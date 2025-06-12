const Joi = require("joi");

const createAssignmentSchema = Joi.object({
  order_id: Joi.number().integer().required(),
  employee_id: Joi.number().integer().required(),
  assigned_at: Joi.date().default(Date.now),
});

const updateAssignmentSchema = Joi.object({
  order_id: Joi.number().integer(),
  employee_id: Joi.number().integer(),
  assigned_at: Joi.date(),
});

module.exports = {
  createAssignmentSchema,
  updateAssignmentSchema,
};
