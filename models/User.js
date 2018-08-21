const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  twitterId: String,
  profilePic: String,
  handle: { type: String, unique: true, min: 1, max: 40 },
  // 0=Player 1=Crew Leader 2=Admin
  role: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  hasProfile: { type: Boolean, default: false }
});

module.exports = User = mongoose.model("users", userSchema);
