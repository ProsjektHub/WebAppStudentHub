const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB URI
const dbURI = 'mongodb://localhost:27017';

// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Define a Mongoose schema and model for user data
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const User = mongoose.model('User', userSchema);

// Route to serve the contact form
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/contact.html");
});

// Handle form submission
app.post("/", function(req, res) {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });

    newUser.save()
        .then(() => {
            // Render the confirmation message on the same page
            res.sendFile(__dirname + "/contact.html", { confirmationMessage: "Takk for din registrering!" });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("En feil oppstod under registreringen.");
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});
