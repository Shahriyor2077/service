const Order = require("../models/orders.model");
const {
  createOrderSchema,
  updateOrderSchema,
} = require("../validations/orders.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createOrder(req, res) {
  try {
    const { error } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Buyurtma yaratildi", order });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getAllOrders(req, res) {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getOrderById(req, res) {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }
    res.json(order);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function updateOrder(req, res) {
  try {
    const { error } = updateOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }
    await order.update(req.body);
    res.json({ message: "Buyurtma yangilandi", order });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function deleteOrder(req, res) {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }
    await order.destroy();
    res.json({ message: "Buyurtma o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
