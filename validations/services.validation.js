const Joi = require("joi");

const createServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().precision(2).min(0).required(),
  duration: Joi.number().integer().min(1).required(),
});

const updateServiceSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().allow("", null),
  price: Joi.number().precision(2).min(0),
  duration: Joi.number().integer().min(1),
});

module.exports = {
  createServiceSchema,
  updateServiceSchema,
};
