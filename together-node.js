const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB URI
const dbURI = 'mongodb://localhost:27017/your_database_name'; // Update 'your_database_name' with your actual database name

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Define a Mongoose schema and model for event data
const eventSchema = new mongoose.Schema({
    eventName: String,
    eventDate: Date,
    eventLocation: String
});

const Event = mongoose.model('Event', eventSchema);

// Route to serve the "Together" page
app.get("/together", function(req, res) {
    res.sendFile(__dirname + "/together.html");
});

// Route to handle sign-up requests for events
app.post("/signup", function(req, res) {
    const newEvent = new Event({
        eventName: req.body.eventName,
        // Use a fixed date for the event
        eventDate: new Date("2024-04-25"),
        eventLocation: req.body.eventLocation
    });

    newEvent.save()
        .then(() => {
            // Redirect to the "Together" page with a success message
            res.redirect("/together?signupSuccess=true");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An error occurred while signing up for the event.");
        });
});

// Route to serve the "Contact" page
app.get("/contact", function(req, res) {
    res.sendFile(__dirname + "/contact.html");
});

// Route to handle form submission for contact page
app.post("/contact-submit", function(req, res) {
    // Handle form submission logic here
    res.send("Form submitted successfully!"); // Placeholder response
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});
