const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology,
} = require("../controllers/technologies.controller");


router.get("/", authMiddleware, getAllTechnologies);
router.get("/:id", authMiddleware, getTechnologyById);
router.post("/", authMiddleware, adminGuard, createTechnology);
router.put("/:id", authMiddleware, adminGuard, updateTechnology);
router.delete("/:id", authMiddleware, adminGuard, deleteTechnology);

module.exports = router;
