const bcrypt = require("bcryptjs");
const Admin = require("../models/admin.model");
const { changePasswordSchema } = require("../validations/admin.validation");

const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "is_active",
        "created_at",
        "updated_at",
      ],
    });
    res.json(admins);
  } catch (error) {
    next(error);
  }
};

const getAdminById = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "email",
        "role",
        "is_active",
        "created_at",
        "updated_at",
      ],
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }
    res.json(admin);
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }
    await admin.destroy();
    res.json({ message: "Admin muvaffaqiyatli o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Hozirgi parol noto'g'ri" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    admin.password_hash = password_hash;
    await admin.save();

    res.json({ message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  changePassword,
};
