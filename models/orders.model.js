const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Order = sequelize.define(
  "orders",
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
    service_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    timestamps: false,
    underscored: true,
    tableName: "orders",
  }
);

// Order modeliga bog'lanishlar
Order.associate = (models) => {
  Order.belongsTo(models.Client, {
    foreignKey: "client_id",
    as: "client",
    onDelete: "CASCADE",
  });

  Order.belongsTo(models.Services, {
    foreignKey: "service_id",
    as: "service",
    onDelete: "CASCADE",
  });

  Order.belongsTo(models.Admin, {
    foreignKey: "owner_id",
    as: "owner",
    onDelete: "CASCADE",
  });

  Order.hasMany(models.Payment, {
    foreignKey: "order_id",
    as: "payments",
  });
};

module.exports = Order;
