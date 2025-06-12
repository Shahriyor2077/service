const Joi = require("joi");

const createClientSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(7).max(20).required(),
  password: Joi.string().min(8).required(),
  balance: Joi.number().min(0).default(0),
});

const updateClientSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phone: Joi.string().min(7).max(20),
  password: Joi.string().min(8),
  balance: Joi.number().min(0),
});

const loginClientSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {
  createClientSchema,
  updateClientSchema,
  loginClientSchema,
};
