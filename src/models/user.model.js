const { DataTypes, Op } = require('sequelize');
const sequelizeTransforms = require('sequelize-transforms');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { roles } = require('../config/roles');
const sequelize = require('../utils/database');

/**
 * @typedef User
 */
const User = sequelize.define(
  'users',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
        if (value.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
      },
    },
    role: {
      type: DataTypes.STRING,
      enum: roles,
      defaultValue: 'user',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      async beforeSave(user) {
        if (user.changed('password')) {
          /* eslint-disable no-param-reassign */
          user.password = await bcrypt.hash(user.password, 8);
        }
      },
    },
  }
);
sequelizeTransforms(User);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
User.isEmailTaken = async function (email, excludeUserId = null) {
  const user = this;
  return user.findOne({ where: { email: email.toLowerCase(), id: { [Op.not]: excludeUserId } } });
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
User.prototype.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

module.exports = User;
