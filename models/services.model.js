const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Services = sequelize.define(
  "services",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "services",
  }
);

// Services modeliga orders bog'lanishini qo'shamiz
Services.associate = (models) => {
  Services.hasMany(models.Order, {
    foreignKey: "service_id",
    as: "service_orders",
    onDelete: "CASCADE",
  });

  Services.belongsTo(models.Admin, {
    foreignKey: "owner_id",
    as: "owner",
    onDelete: "CASCADE",
  });
};

module.exports = Services;
