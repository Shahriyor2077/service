const Joi = require("joi");

const createTransactionSchema = Joi.object({
  client_id: Joi.number().integer().required(),
  type: Joi.string().min(3).max(50).required(),
  amount: Joi.number().precision(2).min(0).required(),
  description: Joi.string().allow("", null),
});

const updateTransactionSchema = Joi.object({
  client_id: Joi.number().integer(),
  type: Joi.string().min(3).max(50),
  amount: Joi.number().precision(2).min(0),
  description: Joi.string().allow("", null),
});

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
};
