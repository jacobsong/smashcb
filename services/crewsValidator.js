const _ = require("lodash");
const Crew = require("../models/Crew");
const User = require("../models/User");

// @desc Checks if profile data is valid
// @param req.body
const validateCrewProfile = async inputData => {
  let errors = {};

  if (inputData.tag === undefined || inputData.crewName === undefined) {
    errors.error = "crewName and tag are required";
    return errors;
  }

  if (inputData.tag.length < 1 || inputData.tag.length > 10) {
    errors.tag = "Crew tag needs to be between 1 and 10 characters";
  }

  if (inputData.crewName.length < 3 || inputData.crewName.length > 40) {
    errors.crewName = "Crew name needs to be between 3 and 40 characters";
  }

  const crewExistsErrors = await crewExists(inputData.crewName);

  if (!_.isEmpty(crewExistsErrors)) {
    errors.crewExists = true;
  }

  return errors;
};

// @desc Checks if user is already in a crew
// @param req.user
const isUserInACrew = async inputData => {
  let errors = {};

  const usersCrew = await User.findOne({ _id: inputData.id }).lean();

  if (usersCrew.crew != null) {
    errors.user = "User is already in a crew";
  }

  return errors;
}

// @desc Checks if handle already exists
// @param (String) handle to check
const crewExists = async inputCrew => {
  let errors = {};

  const crew = await Crew.findOne({ crewName: inputCrew }).lean();

  if (crew) {
    errors.crewExists = true;
  }

  return errors;
};

module.exports = {
  validateCrewProfile,
  isUserInACrew,
  crewExists
};
