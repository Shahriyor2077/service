const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const ownerGuard = require("../middlewares/ownerGuard");
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/services.controller");


router.get("/", getAllServices);
router.get("/:id", getServiceById);


router.post("/", authMiddleware, adminGuard, createService);
router.post("/", authMiddleware, ownerGuard, createService);


router.put("/:id", authMiddleware, adminGuard, updateService);
router.put("/:id", authMiddleware, ownerGuard, updateService);


router.delete("/:id", authMiddleware, adminGuard, deleteService);
router.delete("/:id", authMiddleware, ownerGuard, deleteService);

module.exports = router;
