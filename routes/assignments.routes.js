const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const ownerGuard = require("../middlewares/ownerGuard");
const {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignments.controller");

router.get("/", authMiddleware, getAllAssignments);
router.get("/:id", authMiddleware, getAssignmentById);
router.post("/", authMiddleware, ownerGuard, createAssignment);
router.put("/:id", authMiddleware, ownerGuard, updateAssignment);
router.delete("/:id", authMiddleware, ownerGuard, deleteAssignment);

module.exports = router;
