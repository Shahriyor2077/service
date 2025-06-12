const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const selfGuard = require("../middlewares/selfGuard");
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controller");

router.get("/", authMiddleware, adminGuard, getAllEmployees);
router.get("/:id", authMiddleware, selfGuard, getEmployeeById);
router.post("/", authMiddleware, adminGuard, createEmployee);
router.put("/:id", authMiddleware, selfGuard, updateEmployee);
router.delete("/:id", authMiddleware, adminGuard, deleteEmployee);

module.exports = router;
