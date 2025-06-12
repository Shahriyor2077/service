const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const { getAllAdmins, getAdminById, deleteAdmin, changePassword } = require("../controllers/admin.controller");

router.get("/", authMiddleware, adminGuard, getAllAdmins);
router.get("/:id", authMiddleware, adminGuard, getAdminById);
router.delete("/:id", authMiddleware, adminGuard, deleteAdmin);

router.post(
  "/change-password",
  authMiddleware,
  adminGuard,
  changePassword
);

module.exports = router;
