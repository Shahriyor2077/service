const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const selfGuard = require("../middlewares/selfGuard");
const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clients.controller");


router.post("/", createClient);


router.get("/", authMiddleware, adminGuard, getAllClients);
router.get("/:id", authMiddleware, selfGuard, getClientById);
router.put("/:id", authMiddleware, selfGuard, updateClient);

router.delete("/:id", authMiddleware, adminGuard, deleteClient);

module.exports = router;
