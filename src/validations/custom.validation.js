const { roles } = require('../config/roles');

const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const sortBy = (value, helpers) => {
  if (!value.endsWith(':asc') && !value.endsWith(':desc') && value != null) {
    return helpers.message('sortBy must define ascending or descending order');
  }
  return value;
};

const role = (value, helpers) => {
  if (!roles.includes(value) && value != null) {
    return helpers.message(`role ${value} is not defined`);
  }
  return value;
};

module.exports = {
  objectId,
  password,
  sortBy,
  role,
};
