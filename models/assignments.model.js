const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Assignment = sequelize.define(
  "assignments",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "assignments",
  }
);

module.exports = Assignment;
