const Employee = require("../models/employees.model");
const {
  createEmployeeSchema,
  updateEmployeeSchema,
} = require("../validations/employees.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createEmployee(req, res) {
  try {
    const { error } = createEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const employee = await Employee.create(req.body);
    res.status(201).json({ message: "Xodim yaratildi", employee });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getAllEmployees(req, res) {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getEmployeeById(req, res) {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Xodim topilmadi" });
    }
    res.json(employee);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function updateEmployee(req, res) {
  try {
    const { error } = updateEmployeeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Xodim topilmadi" });
    }
    await employee.update(req.body);
    res.json({ message: "Xodim yangilandi", employee });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function deleteEmployee(req, res) {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Xodim topilmadi" });
    }
    await employee.destroy();
    res.json({ message: "Xodim o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
