const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Employee = sequelize.define(
  "employees",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "employees",
  }
);

module.exports = Employee;
