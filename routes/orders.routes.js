const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const selfGuard = require("../middlewares/selfGuard");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders.controller");


router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, adminGuard, getAllOrders);
router.get("/:id", authMiddleware, selfGuard, getOrderById);
router.put("/:id", authMiddleware, selfGuard, updateOrder);
router.delete("/:id", authMiddleware, adminGuard, deleteOrder);

module.exports = router;
