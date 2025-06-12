const Order = require("../models/orders.model");
const Service = require("../models/services.model");
const { ForbiddenError } = require("../utils/logger");

const orderGuard = async (req, res, next) => {
  try {

    if (req.user.role !== "owner") {
      return next(new ForbiddenError("Faqat egasi bu amalni bajarishi mumkin"));
    }

    if (req.method === "GET" || req.method === "POST") {
      return next();
    }

    const orderId = req.params.id;
    const order = await Order.findByPk(orderId);

    if (!order) {
      return next(new ForbiddenError("Buyurtma topilmadi"));
    }

    const service = await Service.findByPk(order.service_id);
    if (!service) {
      return next(new ForbiddenError("Xizmat topilmadi"));
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = orderGuard;
