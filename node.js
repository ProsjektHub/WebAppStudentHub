/*Author: Abdiqani */

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'abqani2@gmail.com',
        pass: 'yxjc asbb wvmx ypjm'
    }
});

// MongoDB URI
const dbURI = 'mongodb+srv://abdiqanihirsi:pg3RyDhEcpRZiL7J@cluster0.etwl1rv.mongodb.net/App_database?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true'; 

// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Define a Mongoose schema and model for task data
const taskSchema = new mongoose.Schema({
    taskName: String,
    dueDate: Date
});

// Specify the database name as "App_database" when creating the Task model
const Task = mongoose.model('Task', taskSchema);

const transactionSchema = new mongoose.Schema({
    type: String, // Either "Expense" or "Income"
    name: String,
    amount: Number,
    date: Date,
    category: String
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Define a Mongoose schema and model for user data
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Define a Mongoose schema and model for password reset tokens
const tokenSchema = new mongoose.Schema({
    email: String,
    token: String,
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Token expires in 1 hour
});

const Token = mongoose.model('Token', tokenSchema);

// Define a Mongoose schema and model for event data
const eventSchema = new mongoose.Schema({
    eventName: String,
    eventDate: Date,
    eventLocation: String
});

const Event = mongoose.model('Event', eventSchema);

// Define a Mongoose schema and model for contact messages
const contactMessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Update the route handler for serving index.html
app.get("/index.html", function(req, res) {
    const userEmail = req.query.email;

    // Fetch event data
    Event.findOne({ userEmail })
        .then(event => {
            // Fetch budget data
            Transaction.find({})
                .then(budget => {
                    // Calculate total budget amount
                    const totalBudget = budget.reduce((total, transaction) => total + transaction.amount, 0);

                    // Fetch tasks data
                    Task.find({})
                        .then(tasks => {
                            // Render the index.ejs template with event, budget, and tasks data
                            ejs.renderFile(__dirname + "/index.ejs", { event, budget, budgetTotal: totalBudget, tasks }, function(err, str) {
                                if (err) {
                                    console.error(err);
                                    res.status(500).send("An error occurred while rendering the template.");
                                } else {
                                    res.send(str);
                                }
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            res.status(500).send("An error occurred while fetching tasks data.");
                        });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("An error occurred while fetching budget data.");
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An error occurred while fetching event data.");
        });
});

// Serve tasks.html
app.get("/tasks.html", function(req, res) {
    res.sendFile(__dirname + "/tasks.html");
});

// Serve finance.html
app.get("/budget.html", function(req, res) {
    res.sendFile(__dirname + "/budget.html");
});

// Serve community.html
app.get("/community.html", function(req, res) {
    res.sendFile(__dirname + "/community.html");
});

app.get("/login.html", function(req, res) {
    res.sendFile(__dirname + "/login.html");
});
app.get("/register.html", function(req, res) {
    res.sendFile(__dirname + "/register.html");
});
app.get("/forgotPassword.html", function(req, res) {
    res.sendFile(__dirname + "/forgotPassword.html");
});
// Serve resetpassword.html
app.get("/resetPassword.html", function(req, res) {
    res.sendFile(__dirname + "/resetPassword.html");
});

// Route to handle form submission for adding a transaction
app.post("/add-transaction", function(req, res) {
    const { type, name, amount, date, category } = req.body;

    const newTransaction = new Transaction({
        type,
        name,
        amount,
        date,
        category
    });

    newTransaction.save()
    .then(() => {
        console.log("Transaction added successfully!"); // Log success message
        res.send("Transaction added successfully!");
    })
    .catch(err => {
        console.error("Error adding transaction:", err); // Log error message
        res.status(500).send("An error occurred while adding the transaction.");
    });
});

// Route to handle sign-up requests
app.post("/register", function(req, res) {
    const { email, password } = req.body;

    // Check if the email already exists in the database
    User.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                // If the email already exists, return to the registration page with an error message
                res.redirect("/register.html?error=User/email%20already%20exists");
            } else {
                // If the email doesn't exist, hash the password and save the new user
                bcrypt.hash(password, 10, function(err, hashedPassword) {
                    if (err) {
                        console.error("Error hashing password:", err);
                        res.status(500).send("An error occurred while hashing the password.");
                    } else {
                        const newUser = new User({
                            email,
                            password: hashedPassword
                        });

                        newUser.save()
                            .then(() => {
                                res.redirect("/login.html?signupSuccess=true");
                            })
                            .catch(err => {
                                console.error("Error saving user:", err);
                                res.status(500).send("An error occurred while registering the user.");
                            });
                    }
                });
            }
        })
        .catch(err => {
            console.error("MongoDB error:", err);
            res.status(500).send("An error occurred while checking for existing user.");
        });
});

// Route to handle login requests
app.post("/login", function(req, res) {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function(err, result) {
                    if (err) {
                        console.error("bcrypt error:", err);
                        res.status(500).send("An error occurred while comparing passwords.");
                    } else {
                        if (result) {
                            // Redirect to the index page with the user's email as a query parameter
                            res.redirect(`/index.html?email=${encodeURIComponent(email)}`);
                        } else {
                            // If the email or password is invalid, return to the login page with an error message
                            res.redirect("/login.html?error=Invalid%20email%20or%20password");
                        }
                    }
                });
            } else {
                // If the email or password is invalid, return to the login page with an error message
                res.redirect("/login.html?error=Invalid%20email%20or%20password");
            }
        })
        .catch(err => {
            console.error("MongoDB error:", err);
            res.status(500).send("An error occurred while finding the user.");
        });
});

// Route to handle forgot password requests
app.post("/forgot-password", function(req, res) {
    const { email } = req.body;
    const token = generateToken();
    const newToken = new Token({
        email,
        token
    });

    newToken.save()
        .then(() => {
            // Send email with token
            const mailOptions = {
                from: 'abqani2@gmail.com',
                to: email,
                subject: 'Password Reset Token',
                text: `Your password reset token is: ${token}`
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.error(error);
                    res.status(500).send("An error occurred while sending the email.");
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send("Token generated successfully. Check your email for password reset instructions.");
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An error occurred while generating the token.");
        });
});

// Route to handle password reset form submission
app.post("/reset-password", function(req, res) {
    const { email, password, token } = req.body;
    Token.findOne({ email, token })
        .then(tokenDoc => {
            if (tokenDoc) {
                User.findOneAndUpdate({ email }, { password })
                    .then(() => {
                        Token.findOneAndDelete({ email, token })
                            .then(() => {
                                res.send("Password reset successful!");
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send("An error occurred while deleting the token.");
                            });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send("An error occurred while updating the password.");
                    });
            } else {
                res.status(401).send("Invalid or expired token.");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An error occurred while verifying the token.");
        });
});

// Route to handle adding a new task
app.post('/add-task', (req, res) => {
    const taskInput = req.body.taskInput;
    const dueDate = req.body.dueDate;

    console.log('Task Input:', taskInput); // Log the task input
    console.log('Due Date:', dueDate); // Log the due date

    // Create a new task instance
    const newTask = new Task({
        taskName: taskInput,
        dueDate: dueDate
    });

    // Save the new task to the database
    newTask.save()
        .then((savedTask) => {
            console.log('Task added to database:', savedTask);
            res.status(200).send('Task added successfully');
        })
        .catch((err) => {
            console.error('Error adding task to database:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Route to handle sign-up requests for events
app.post("/signup", function(req, res) {
    const newEvent = new Event({
        eventName: req.body.eventName,
        // Use a fixed date for the event
        eventDate: new Date("2024-05-25"),
        eventLocation: req.body.eventLocation
    });

    newEvent.save()
        .then(() => {
            // Redirect to the "Community" page with a success message
            res.redirect("/community.html?signupSuccess=true");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An error occurred while signing up for the event.");
        });
});

// Serve contact.html
app.get("/contact.html", function(req, res) {
    res.sendFile(__dirname + "/contact.html");
});

// Route to handle form submission for contact page
app.post("/contact-submit", function(req, res) {
    const { name, email, message } = req.body;
    const newContactMessage = new ContactMessage({
        name,
        email,
        message
    });
    newContactMessage.save()
        .then(() => {
            res.send("Form submitted successfully!");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("An error occurred while processing the form.");
        });
});

// Logout route
app.get("/logout", function(req, res) {
    // Retrieve the user's email from the query parameter
    const userEmail = req.query.email;
    
    // Check if the user's email is provided
    if (!userEmail) {
        console.error("User email not provided in the query parameter.");
        return res.status(400).send("User email not provided.");
    }
    
    // Remove events associated with the logged-out user
    Event.deleteMany({ userEmail })
        .then(() => {
            console.log("Events deleted for user:", userEmail); // Debug log
            // Redirect to index.html after removing events
            res.redirect("/index.html");
        })
        .catch(err => {
            console.error("Error deleting events:", err);
            res.status(500).send("An error occurred while logging out.");
        });
});

// Start the server
const PORT = process.env.PORT || 3001; // Change the port to 3000
app.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
});

function generateToken() {
    return Math.random().toString(36).substring(2);
}
