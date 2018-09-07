const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    googleId: String,
    facebookId: String,
    twitterId: String,
    profilePic: String,
    handle: { type: String, min: 1, max: 20 },
    role: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    hasProfile: { type: Boolean, default: false },
    invites: [ { type: Schema.Types.ObjectId, ref: "crews"} ],
    crew: { type: Schema.Types.ObjectId, ref: "crews" }
  },
  {
    collation: { locale: "en", strength: 1 }
  }
);

userSchema.index(
  { handle: 1 },
  { unique: true,
    partialFilterExpression: { handle: { $exists: true } },
    collation: { locale: "en", strength: 1 }
  }
);

module.exports = User = mongoose.model("users", userSchema);
