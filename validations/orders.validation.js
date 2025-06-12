const Joi = require("joi");

const createOrderSchema = Joi.object({
  client_id: Joi.number().integer().required(),
  service_id: Joi.number().integer().required(),
  owner_id: Joi.number().integer().required(),
  order_date: Joi.date().default(Date.now),
  status: Joi.string()
    .valid("pending", "completed", "cancelled")
    .default("pending"),
});

const updateOrderSchema = Joi.object({
  client_id: Joi.number().integer(),
  service_id: Joi.number().integer(),
  owner_id: Joi.number().integer(),
  order_date: Joi.date(),
  status: Joi.string().valid("pending", "completed", "cancelled"),
});

module.exports = {
  createOrderSchema,
  updateOrderSchema,
};
