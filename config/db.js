const { Sequelize } = require("sequelize");
const config = require("config");
const logger = require("../utils/logger");

const sequelize = new Sequelize(
  config.get("db.name"),
  config.get("db.user"),
  config.get("db.password"),
  {
    host: config.get("db.host"),
    port: config.get("db.port"),
    dialect: "postgres",
    logging: (msg) => logger.debug(msg),
  }
);

module.exports = sequelize;
