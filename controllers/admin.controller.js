const Admin = require("../models/admin.model");


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

module.exports = {
  getAllAdmins,
  getAdminById,
  deleteAdmin,
};
