const Joi = require("joi");

const getServicesByDateRangeSchema = Joi.object({
  start_date: Joi.date().iso().required().messages({
    "date.base": "Boshlang'ich sana noto'g'ri formatda",
    "date.format": "Boshlang'ich sana ISO formatda bo'lishi kerak (YYYY-MM-DD)",
    "any.required": "Boshlang'ich sana majburiy",
  }),
  end_date: Joi.date().iso().min(Joi.ref("start_date")).required().messages({
    "date.base": "Tugash sanasi noto'g'ri formatda",
    "date.format": "Tugash sanasi ISO formatda bo'lishi kerak (YYYY-MM-DD)",
    "date.min": "Tugash sanasi boshlang'ich sanadan keyin bo'lishi kerak",
    "any.required": "Tugash sanasi majburiy",
  }),
});

const getClientsByDateRangeSchema = Joi.object({
  start_date: Joi.date().iso().required().messages({
    "date.base": "Boshlang'ich sana noto'g'ri formatda",
    "date.format": "Boshlang'ich sana ISO formatda bo'lishi kerak (YYYY-MM-DD)",
    "any.required": "Boshlang'ich sana majburiy",
  }),
  end_date: Joi.date().iso().min(Joi.ref("start_date")).required().messages({
    "date.base": "Tugash sanasi noto'g'ri formatda",
    "date.format": "Tugash sanasi ISO formatda bo'lishi kerak (YYYY-MM-DD)",
    "date.min": "Tugash sanasi boshlang'ich sanadan keyin bo'lishi kerak",
    "any.required": "Tugash sanasi majburiy",
  }),
});

module.exports = {
  getServicesByDateRangeSchema,
  getClientsByDateRangeSchema,
};
