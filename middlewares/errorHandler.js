const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user,
  });

  if (err.isJoi) {
    return res.status(400).json({
      message: "Validatsiya xatosi",
      errors: err.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      message: "Validatsiya xatosi",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      message: "Bu ma'lumot allaqachon mavjud",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      message: "Bog'langan ma'lumot topilmadi",
    });
  }

  if (err.name === "SequelizeRecordNotFoundError") {
    return res.status(404).json({
      message: "Ma'lumot topilmadi",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Yaroqsiz token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token muddati tugagan",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Serverda kutilmagan xatolik yuz berdi";

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
