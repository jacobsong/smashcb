const express = require("express");
const _ = require("lodash");
const validateProfile = require("../services/profileValidator");
const router = express.Router();

// Load middleware
const requireLogin = require("../services/requireLogin");

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

  const user = await User.findOne({ _id: req.user.id });
  console.log(user);
  const updatedUser = await User.findOneAndUpdate(
    {
      id: req.user.id
    },
    {
      $set: {
        handle: req.body.handle,
        hasProfile: true,
        new: true
      }
    }
  );

  res.json(updatedUser);
});

module.exports = router;
