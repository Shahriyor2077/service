const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ownerGuard = require("../middlewares/ownerGuard");
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactions.controller");

router.get("/", authMiddleware, getAllTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.post("/", authMiddleware, ownerGuard, createTransaction);
router.put("/:id", authMiddleware, ownerGuard, updateTransaction);
router.delete("/:id", authMiddleware, ownerGuard, deleteTransaction);

module.exports = router;
