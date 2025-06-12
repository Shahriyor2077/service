const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const clientGuard = require("../middlewares/clientGuard");
const {
  adminRegister,
  adminLogin,
  adminLogout,
  adminRefreshToken,
  ownerActivate,
  clientRegister,
  clientLogin,
  clientLogout,
  clientRefreshToken,
  clientActivate,
} = require("../controllers/auth.controller");

// Admin
router.post("/admin/register", adminRegister);
router.post("/admin/login", adminLogin);
router.post("/admin/logout", authMiddleware, adminGuard, adminLogout);
router.post(
  "/admin/refresh-token",
  authMiddleware,
  adminGuard,
  adminRefreshToken
);

// Client
router.post("/client/register", clientRegister);
router.post("/client/login", clientLogin);
router.post("/client/logout", authMiddleware, clientGuard, clientLogout);
router.post(
  "/client/refresh-token",
  authMiddleware,
  clientGuard,
  clientRefreshToken
);
router.get("/client/activate/:token", clientActivate);
router.get("/owner/activate/:token", ownerActivate);

module.exports = router;
