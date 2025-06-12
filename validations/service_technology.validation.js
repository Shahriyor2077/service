const Joi = require("joi");

const createServiceTechnologySchema = Joi.object({
  service_id: Joi.number().integer().required(),
  technology_id: Joi.number().integer().required(),
});

const updateServiceTechnologySchema = Joi.object({
  service_id: Joi.number().integer(),
  technology_id: Joi.number().integer(),
});

module.exports = {
  createServiceTechnologySchema,
  updateServiceTechnologySchema,
};
