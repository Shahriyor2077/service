const Joi = require("joi");

const createPaymentSchema = Joi.object({
  order_id: Joi.number().integer().required(),
  amount: Joi.number().precision(2).min(0).required(),
  paid_at: Joi.date().default(Date.now),
  payment_method: Joi.string().min(2).max(50),
  status: Joi.string()
    .valid("pending", "completed", "failed")
    .default("pending"),
});

const updatePaymentSchema = Joi.object({
  order_id: Joi.number().integer(),
  amount: Joi.number().precision(2).min(0),
  paid_at: Joi.date(),
  payment_method: Joi.string().min(2).max(50),
  status: Joi.string().valid("pending", "completed", "failed"),
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema,
};
