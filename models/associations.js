const Client = require("./clients.model");
const Admin = require("./admin.model");
const Services = require("./services.model");
const Order = require("./orders.model");
const Payment = require("./payments.model");
const Transaction = require("./transactions.model");
const Employee = require("./employees.model");
const Assignment = require("./assignments.model");
const Technology = require("./technologies.model");
const ServiceTechnology = require("./service_technology.model");


const models = {
  Client,
  Admin,
  Services,
  Order,
  Payment,
  Transaction,
  Employee,
  Assignment,
  Technology,
  ServiceTechnology,
};


Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
