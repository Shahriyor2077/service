const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Technology = sequelize.define(
  "technologies",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "technologies",
  }
);

module.exports = Technology;
