const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: String,
  facebookId: String,
  twitterId: String,
  profilePic: String
});

module.exports = User = mongoose.model("users", userSchema);
