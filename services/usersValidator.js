const _ = require("lodash");
const User = require("../models/User");

// @desc Checks if profile data is valid
// @param req.body
const validateProfile = async inputData => {
  let errors = {};

  if (inputData.handle === undefined) {
    errors.error = "handle is required";
    return errors;
  }

  const reg = /\W|_/;
  if (reg.test(inputData.handle)) {
    errors.handle = "Special characters and spaces not allowed";
  }
  
  if (inputData.handle.length < 1 || inputData.handle.length > 20) {
    errors.handle = "Handle needs to be between 1 and 20 characers";
  }

  const handleExistsErrors = await handleExists(inputData.handle);

  if (!_.isEmpty(handleExistsErrors)) {
    errors.handleExists = true;
  }

  return errors;
};

// @desc Checks if handle already exists
// @param (String) handle to check
const handleExists = async inputHandle => {
  let errors = {};

  const user = await User.findOne({ handle: inputHandle }).lean();

  if (user) {
    errors.handleExists = true;
  }

  return errors;
};

// @desc Checks if role is valid and handle does not belong to an Admin
// @param req.body
const isRoleValid = async inputData => {
  let errors = {};

  const validRoles = [0, 1, 2, 3];

  if (!validRoles.includes(inputData.role)) {
    errors.role = "Role is not valid";
  }

  const inputUser = await User.findOne({ handle: inputData.handle }).lean();

  if (inputUser === null || inputUser === undefined) {
    errors.handle = "Handle not found";
    return errors;
  } 
  
  if (inputUser.role === 4) {
    errors.role = "Can not change Admin";
  }

  return errors;
};

module.exports = {
  validateProfile,
  handleExists,
  isRoleValid
};
