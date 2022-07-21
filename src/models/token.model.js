const { DataTypes } = require('sequelize');
const sequelizeTransforms = require('sequelize-transforms');
const { tokenTypes } = require('../config/tokens');
const sequelize = require('../utils/database');

/**
 * @typedef Token
 */
const Token = sequelize.define(
  'tokens',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['token'],
      },
    ],
  }
);
sequelizeTransforms(Token);

module.exports = Token;
