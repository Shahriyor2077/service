const Joi = require("joi");

const createTechnologySchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});

const updateTechnologySchema = Joi.object({
  name: Joi.string().min(2).max(100),
});

module.exports = {
  createTechnologySchema,
  updateTechnologySchema,
};
