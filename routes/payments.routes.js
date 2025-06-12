const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleGuard = require("../middlewares/roleGuard");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
} = require("../controllers/payments.controller");

router.get("/", authMiddleware, getAllPayments);
router.get("/:id", authMiddleware, getPaymentById);

router.post("/", authMiddleware, roleGuard(["client", "owner"]), createPayment);

router.put("/:id", authMiddleware, roleGuard(["owner"]), updatePayment);

router.delete("/:id", authMiddleware, roleGuard(["admin"]), deletePayment);

module.exports = router;
