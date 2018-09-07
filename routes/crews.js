const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Load Validators
const { validateCrewProfile, crewExists } = require("../services/crewsValidator");

// Load middleware
const { requireLogin, requireRole } = require("../services/authMiddleware");

// Load models
const User = require("../models/User");
const Crew = require("../models/Crew");

// @route   GET /api/crew/profile/:crew
// @desc    get a crew profile
// @access  Public
router.get("/profile/:crew", async (req, res) => {
  const crew = await Crew.findOne({ crewName: req.params.crew })
    .populate("leader", ["handle"])
    .lean();
  res.json(crew);
});

// @route   POST /api/crew/profile
// @desc    create a crew profile
// @access  Private (Role cd 2)
// @body    { crewName: String }
router.post("/profile", requireLogin, requireRole([2]), async (req, res) => {
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
// @access  Private (Role cd 1 or 2)
// @body    { handle: String }
router.post("/invite", requireLogin, requireRole([1, 2]), async (req, res) => {
  const player = await User.findOne({ handle: req.body.handle });
  
  player.invites.push(req.user.crew);

  await player.save();

  res.json(player);

});

module.exports = router;
