const mongoose = require("mongoose");
const { Schema } = mongoose;

const crewSchema = new Schema(
  {
    crewName: { type: String, min: 3, max: 40 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    leader: { type: Schema.Types.ObjectId, ref: "users" },
    recruiting: Boolean,
    tag: { type: String, min: 1, max: 10 }
  },
  {
    collation: { locale: "en", strength: 1 }
  }
);

crewSchema.index(
  { crewName: 1 },
  { unique: true,
    partialFilterExpression: { crewName: { $exists: true } },
    collation: { locale: "en", strength: 1 }
  }
)

module.exports = Crew = mongoose.model("crews", crewSchema);
