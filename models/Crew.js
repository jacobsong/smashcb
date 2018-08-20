const mongoose = require("mongoose");

const crewSchema = new mongoose.Schema({
  crewName: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  leader: { type: Schema.Types.ObjectId, ref: "users" }
});

module.exports = Crew = mongoose.model("crews", crewSchema);
