const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  facebookId: String,
  twitterId: String,
  profilePic: String,
  handle: { type: String, min: 1, max: 20 },
  // 0=Player 1=Crew Leader 2=Admin
  role: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  hasProfile: { type: Boolean, default: false },
  crew: { type: Schema.Types.ObjectId, ref: "crews" }
});

userSchema.index(
  { handle: 1 },
  { unique: true, partialFilterExpression: { handle: { $exists: true } } }
);

module.exports = User = mongoose.model("users", userSchema);
