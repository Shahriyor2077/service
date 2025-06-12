const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const orderGuard = require("../middlewares/orderGuard");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders.controller");
const adminGuard = require("../middlewares/adminGuard");

router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, orderGuard, createOrder);
router.put("/:id", authMiddleware, orderGuard, updateOrder);
router.delete("/:id", authMiddleware, orderGuard, deleteOrder);

module.exports = router;
