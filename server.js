const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieSession = require("cookie-session");
const keys = require("./config/keys");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const crewRoutes = require("./routes/crews");

// Initialize express
const app = express();

// Connect MongoDB
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(
  () => {
    console.log("MongoDB connected...\n");
  },
  err => {
    console.log("MongoDB could not connect...\n" + err);
  }
);

// Middleware
require("./services/passport");
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
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/crew", crewRoutes);

// Serve production assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  // Express will serve up index.html file if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
