const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const ServiceTechnology = sequelize.define(
  "service_technology",
  {
    service_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
    technology_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "service_technology",
  }
);

module.exports = ServiceTechnology;
