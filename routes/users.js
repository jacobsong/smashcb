const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Load validators
const { validateProfile, handleExists, isRoleValid } = require("../services/usersValidator");

// Load middleware
const { requireLogin, requireRole } = require("../services/authMiddleware");

// Load models
const User = require("../models/User");

// @route   GET /api/user/profile/:handle
// @desc    get user profile
// @access  Public
router.get("/profile/:handle", async (req, res) => {
  const profile = await User.findOne({ handle: req.params.handle })
    .populate("crew", ["crewName"] )
    .lean();
  return res.json(profile);
});

// @route   GET /api/user/handle/exists/:handle
// @desc    check if handle exists
// @access  Public
router.get("/handle/exists/:handle", async (req, res) => {
  const errors = await handleExists(req.params.handle);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  return res.json({ handleExists: false });
});

// @route   POST /api/user/profile
// @desc    create user profile
// @access  Private
// @body    { handle: string }
router.post("/profile", requireLogin, async (req, res) => {
  const errors = await validateProfile(req.body);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  await User.updateOne(
    { _id: req.user.id },
    { $set: { handle: req.body.handle, hasProfile: true } }
  );

  return res.json({ success: true });
});

// @route   POST /api/user/assign/role
// @desc    assign a role to a user
// @access  Private (Role cd 4)
// @body    { handle: string, role: int }
router.post("/assign/role", requireLogin, requireRole([4]), async (req, res) => {
  const errors = await isRoleValid(req.body);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  await User.updateOne(
    { handle: req.body.handle },
    { $set: { role: req.body.role } }
  );

  return res.json({ success: true });
});

module.exports = router;
