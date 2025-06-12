const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Payment = sequelize.define(
  "payments",
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
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paid_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "payments",
  }
);

// Paymentga order bog'lanadi
Payment.associate = (models) => {
  Payment.belongsTo(models.Order, {
    foreignKey: "order_id",
    as: "order",
    onDelete: "CASCADE",
  });
};

module.exports = Payment;
