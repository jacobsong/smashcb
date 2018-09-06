const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Load middleware
const { requireLogin, requireCrewLeader } = require("../services/authMiddleware");

// Load models
const User = require("../models/User");
const Crew = require("../models/Crew");

// @route   GET /api/crew/profile/:crew
// @desc    get a crew profile
// @access  Public
router.get("/profile/:crew", async (req, res) => {
  const crew = await Crew.findOne({ crewName: req.params.crew })
    .populate("leader", ["handle"])
    .lean()
    .catch;
  res.json(crew);
});

// @route   POST /api/crew/profile
// @desc    create a crew profile
// @access  Private (Crew Leader)
// @body    { crewName: String }
router.post("/profile", requireLogin, requireCrewLeader, async (req, res) => {
  const newCrew = await new Crew({
    crewName: req.body.crewName,
    leader: req.user.id
  }).save();

  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { crew: newCrew._id } }
  )

  res.json(newCrew);
});

// @route   POST /api/crew/invite
// @desc    invite player to crew
// @access  Private (Crew Leader)
// @body    { handle: String }
router.post("/invite", requireLogin, requireCrewLeader, async (req, res) => {
  const player = await User.findOne({ handle: req.body.handle });
  
  player.invites.push(req.user.crew);
  
  await player.save();

  res.json();

});

module.exports = router;
