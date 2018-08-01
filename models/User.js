const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String
});

module.exports = User = mongoose.model("users", userSchema);
