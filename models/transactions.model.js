const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Transaction = sequelize.define(
  "transactions",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "transactions",
  }
);

module.exports = Transaction;
