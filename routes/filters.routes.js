const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const ownerGuard = require("../middlewares/ownerGuard");
const {
  getServicesByDateRange,
  getClientsByDateRange,
  getCancelledClientsByDateRange,
  getTopOwnersByService,
  getClientPaymentsByService,
} = require("../controllers/filters.controller");

// 1. Berilgan vaqt oralig'ida foydalanilgan xizmatlar ro'yxati
router.get(
  "/services-by-date",
  authMiddleware,
  adminGuard,
  ownerGuard,
  getServicesByDateRange
);
router.get(
  "/services-by-date",
  authMiddleware,
  ownerGuard,
  getServicesByDateRange
);

// 2. Berilgan vaqt oralig'ida xizmatdan foydalangan Clientlar ro'yxati
router.get(
  "/clients-by-date",
  authMiddleware,
  adminGuard,
  getClientsByDateRange
);
router.get(
  "/clients-by-date",
  authMiddleware,
  ownerGuard,
  getClientsByDateRange
);

// 3. Berilgan vaqt oralig'ida xizmatni bekor qilgan Clientlar ro'yxati
router.get(
  "/cancelled-clients-by-date",
  authMiddleware,
  adminGuard,
  getCancelledClientsByDateRange
);
router.get(
  "/cancelled-clients-by-date",
  authMiddleware,
  ownerGuard,
  getCancelledClientsByDateRange
);

// 4. Berilgan xizmat nomi bo'yicha eng ko'p bajargan Ownerlar ro'yxati
router.get(
  "/top-owners-by-service",
  authMiddleware,
  adminGuard,
  getTopOwnersByService
);
router.get(
  "/top-owners-by-service",
  authMiddleware,
  ownerGuard,
  getTopOwnersByService
);

// 5. Berilgan Client ma'lumotlari asosida qaysi xizmatga amalga oshirilgan Paymentlar ro'yxati
router.get(
  "/client-payments/:client_id",
  authMiddleware,
  adminGuard,
  getClientPaymentsByService
);
router.get(
  "/client-payments/:client_id",
  authMiddleware,
  ownerGuard,
  getClientPaymentsByService
);

module.exports = router;
