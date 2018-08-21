const express = require("express");
const _ = require("lodash");
const { validateProfile, handleExists, isRoleValid } = require("../services/usersValidator");
const router = express.Router();

// Load middleware
const { requireLogin, requireAdmin } = require("../services/authMiddleware");

// Load models
const User = require("../models/User");

// @route   POST /api/user/profile
// @desc    create user profile
// @access  Private
router.post("/profile", requireLogin, async (req, res) => {
  const errors = validateProfile(req.body);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const handleErrors = await handleExists(req.body.handle);

  if (!_.isEmpty(handleErrors)) {
    return res.status(400).json(handleErrors);
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      $set: {
        handle: req.body.handle,
        hasProfile: true
      }
    },
    { new: true }
  );

  res.json(updatedUser);
});

// @route   POST /api/user/handle/exists
// @desc    check if handle exists
// @access  Public
router.post("/handle/exists", async (req, res) => {
  const errors = await handleExists(req.body.handle);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }
  return res.json({ handle: "Available" });
});

// @route   POST /api/user/assign/role
// @desc    assign a role to a user
// @access  Private (Admin)
router.post("/assign/role", requireLogin, requireAdmin, async (req, res) => {
  const errors = await isRoleValid(req.body);

  if (!_.isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const updatedUser = await User.findOneAndUpdate(
    { handle: req.body.handle },
    { $set: { role: req.body.role } },
    { new: true }
  );

  res.json(updatedUser);
});

module.exports = router;
