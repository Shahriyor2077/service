const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const {
  getAllAdmins,
  getAdminById,
  deleteAdmin,
} = require("../controllers/admin.controller");


router.get("/", authMiddleware, adminGuard, getAllAdmins);
router.get("/:id", authMiddleware, adminGuard, getAdminById);
router.delete("/:id", authMiddleware, adminGuard, deleteAdmin);

module.exports = router;
