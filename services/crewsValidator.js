const _ = require("lodash");

// @desc Checks if profile data is valid
// @param req.body
const validateCrewProfile = async inputData => {
  let errors = {};

  if (inputData.handle.length > 20) {
    errors.handle = "Handle needs to be between 1 and 20 characers";
  }

  if (_.isEmpty(inputData.handle)) {
    errors.handle = "Handle is required";
  }

  const handleErrors = await handleExists(inputData.handle);

  if (!_.isEmpty(handleErrors)) {
    errors.handleExists = true;
  }

  return errors;
};

// @desc Checks if handle already exists
// @param (String) handle to check
const crewExists = async inputCrew => {
  let errors = {};

  const user = await User.findOne({ handle: inputHandle }).lean();

  if (user) {
    errors.handleExists = true;
  }

  return errors;
};

module.exports = {
  validateCrewProfile,
  crewExists
};
