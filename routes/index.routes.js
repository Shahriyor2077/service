const express = require("express");
const router = express.Router();


const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const servicesRoutes = require("./services.routes");
const clientsRoutes = require("./clients.routes");
const ordersRoutes = require("./orders.routes");
const employeesRoutes = require("./employees.routes");
const assignmentsRoutes = require("./assignments.routes");
const paymentsRoutes = require("./payments.routes");
const transactionsRoutes = require("./transactions.routes");
const technologiesRoutes = require("./technologies.routes");
const serviceTechnologyRoutes = require("./service_technology.routes");
const filtersRoutes = require("./filters.routes");


router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/services", servicesRoutes);
router.use("/clients", clientsRoutes);
router.use("/orders", ordersRoutes);
router.use("/employees", employeesRoutes);
router.use("/assignments", assignmentsRoutes);
router.use("/payments", paymentsRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/technologies", technologiesRoutes);
router.use("/service-technology", serviceTechnologyRoutes);
router.use("/filters", filtersRoutes);

module.exports = router;
