const _ = require("lodash");

module.exports = inputData => {
  let errors = {};

  if (inputData.handle.length > 40) {
    errors.handle = "Handle needs to be between 1 and 40 characers";
  }

  if (_.isEmpty(inputData.handle)) {
    errors.handle = "Handle is required";
  }

  return errors;
};
