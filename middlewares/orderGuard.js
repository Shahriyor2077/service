const Order = require("../models/orders.model");
const Service = require("../models/services.model");
const { ForbiddenError } = require("../utils/logger");

const orderGuard = async (req, res, next) => {
  try {

    if (req.user.role === "client" || req.user.role === "owner") {
      return next();
    }
    return next(
      new ForbiddenError("Faqat mijoz yoki egasi bu amalni bajarishi mumkin")
    );
  } catch (error) {
    next(error);
  }
};

module.exports = orderGuard;
