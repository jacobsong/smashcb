const _ = require("lodash");
const User = require("../models/User");

// @desc Checks if profile data is valid
// @param req.body
const validateProfile = inputData => {
  let errors = {};

  if (inputData.handle.length > 20) {
    errors.handle = "Handle needs to be between 1 and 20 characers";
  }

  if (_.isEmpty(inputData.handle)) {
    errors.handle = "Handle is required";
  }

  return errors;
};

// @desc Checks if handle already exists
// @param (String) handle to check
const handleExists = async inputHandle => {
  let errors = {};

  const user = await User.findOne({ handle: inputHandle });

  if (user) {
    errors.handle = "Handle already exists";
  }

  return errors;
};

// @desc Checks if role is valid and handle does not belong to an Admin
// @param req.body
const isRoleValid = async inputData => {
  let errors = {};

  const validRoles = [0, 1, 2];

  if (!validRoles.includes(inputData.role)) {
    errors.role = "Role is not valid";
  }

  const user = await User.findOne({ handle: inputData.handle });

  if (user.role === 2) {
    errors.role = "Can not change Admin";
  }

  return errors;
};

module.exports = {
  validateProfile,
  handleExists,
  isRoleValid
};
