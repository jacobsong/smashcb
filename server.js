const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const keys = require("./config/keys");

// Initialize express
const app = express();

// Connect MongoDB
mongoose.connect(keys.mongoURI);

// Middleware
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Routes

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
