const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Load Validators
const { validateCrewProfile, isUserInACrew, crewExists } = require("../services/crewsValidator");

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
    .populate("leaders", ["handle"])
    .lean();
  return res.json(crew);
});

// @route   GET /api/crew/exists/:crewName
// @desc    check if crew exists
// @access  Public
router.get("/exists/:crewName", async (req, res) => {
  const errors = await crewExists(req.params.crewName);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  return res.json({ crewExists: false });
});

// @route   POST /api/crew/profile
// @desc    create a crew profile
// @access  Private (Role cd 2)
// @body    { crewName: String, tag: String }
router.post("/profile", requireLogin, requireRole([2]), async (req, res) => {
  const userErrors = await isUserInACrew(req.user);

  if (!_.isEmpty(userErrors)) {
    return res.status(400).json(userErrors);
  }

  const errors = await validateCrewProfile(req.body);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const newCrew = await new Crew({
    crewName: req.body.crewName,
    leader: req.user.id,
    tag: req.body.tag
  }).save();

  await User.updateOne(
    { _id: req.user.id },
    { $set: { crew: newCrew._id } }
  );

  return res.json({ success: true });
});

// @route   POST /api/crew/invite
// @desc    invite player to crew
// @access  Private (Role cd 1 or 2)
// @body    { handle: String }
router.post("/invite", requireLogin, requireRole([1, 2]), async (req, res) => {
  const updated = await User.updateOne(
    { handle: req.body.handle },
    { $push: { invites: req.user.crew } }
  );
  
  if (updated.ok != 1) {
    return res.status(400).json({ success: false });
  }

  return res.json({ success: true });
});

// @route   POST /api/crew/invite/accept
// @desc    invite player to crew
// @access  Private
// @body    { crew: String }
router.post("/invite/accept", requireLogin, async (req, res) => {
  await User.updateOne(
    { _id: req.user.id },
    { 
      $set: { crew: req.body.crew },
      $pull: { invites: req.body.crew } 
    }
  );

  return res.json({ success: true });
});

module.exports = router;
