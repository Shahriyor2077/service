const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clients.controller");

// Mijoz yaratish uchun adminGuard
router.post("/", createClient);

// Boshqa operatsiyalar uchun admin guard talab qilinadi
router.get("/", authMiddleware, adminGuard, getAllClients);
router.get("/:id", authMiddleware, adminGuard, getClientById);
router.put("/:id", authMiddleware, adminGuard, updateClient);
router.delete("/:id", authMiddleware, adminGuard, deleteClient);

module.exports = router;
