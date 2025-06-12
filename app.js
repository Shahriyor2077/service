const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const sequelize = require("./config/db");
const config = require("config");

const routes = require("./routes/index.routes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });
  next();
});

app.use("/api", routes);

app.use(errorHandler);

const PORT = config.get("port");

async function start() {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");

    await sequelize.sync({ alter: true });
    logger.info("Ma'lumotlar bazasi jadvallari yangilandi");

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Unable to start server:", error);
    process.exit(1);
  }
}

start();

module.exports = app;
