const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ownerGuard = require("../middlewares/ownerGuard");
const {
  createServiceTechnology,
  getAllServiceTechnologies,
  getServiceTechnologyById,
  deleteServiceTechnology,
} = require("../controllers/service_technology.controller");

router.get("/", authMiddleware, getAllServiceTechnologies);
router.get(
  "/:service_id/:technology_id",
  authMiddleware,
  getServiceTechnologyById
);
router.post("/", authMiddleware, ownerGuard, createServiceTechnology);
router.delete(
  "/:service_id/:technology_id",
  authMiddleware,
  ownerGuard,
  deleteServiceTechnology
);

module.exports = router;
