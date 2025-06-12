const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const selfGuard = require("../middlewares/selfGuard");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/payments.controller");


router.post("/", authMiddleware, createPayment);
router.get("/", authMiddleware, adminGuard, getAllPayments);
router.get("/:id", authMiddleware, selfGuard, getPaymentById);
router.put("/:id", authMiddleware, selfGuard, updatePayment);
router.delete("/:id", authMiddleware, adminGuard, deletePayment);

module.exports = router;
