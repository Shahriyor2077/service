const Joi = require("joi");

const createAdminSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "owner").required(),
  is_active: Joi.boolean().default(true),
});

const updateAdminSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password_hash: Joi.string().min(8),
  role: Joi.string().min(3).max(50),
  is_active: Joi.boolean(),
});

const loginAdminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(), // `password_hash` emas, `password` bo'lishi kerak
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Yangi parollar mos kelmadi" }),
});

module.exports = {
  createAdminSchema,
  updateAdminSchema,
  loginAdminSchema,
  changePasswordSchema,
};
