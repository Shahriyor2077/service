const Joi = require("joi");

const createEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  position: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
});

const updateEmployeeSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  position: Joi.string().min(3).max(100),
  email: Joi.string().email(),
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
};
