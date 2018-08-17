const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
const auth = require("./routes/auth");

// Initialize express
const app = express();

// Connect MongoDB
mongoose
  .connect(
    keys.mongoURI,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log("MongoDB connected...");
    },
    err => {
      console.log("MongoDB could not connect...\n" + err);
    }
  );

// Middleware
require("./service/passport");
app.use(bodyParser.json());
app.use(
  cookieSession({
    // 30 days in milliseconds, first int = number of days
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", auth);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
