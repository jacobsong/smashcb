const express = require("express");
const _ = require("lodash");
const router = express.Router();

// Load middleware
const { requireLogin } = require("../services/authMiddleware");

// Load models
const User = require("../models/User");
const Crew = require("../models/Crew");

// @route   POST /api/crew/profile
// @desc    create a crew profile
// @access  Private (Crew Leader)
router.post("/profile", requireLogin, () => {
  console.log("");
});

module.exports = router;
