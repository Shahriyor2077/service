const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminGuard");
const ownerGuard = require("../middlewares/ownerGuard");
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employees.controller");

router.get("/", authMiddleware, getAllEmployees);
router.get("/:id", authMiddleware, getEmployeeById);
router.post("/", authMiddleware, [adminGuard, ownerGuard], createEmployee);
router.put("/:id", authMiddleware, [adminGuard, ownerGuard], updateEmployee);
router.delete("/:id", authMiddleware, [adminGuard, ownerGuard], deleteEmployee);

module.exports = router;
