const Service = require("../models/services.model");
const { Op } = require("sequelize");
const {
  createServiceSchema,
  updateServiceSchema,
} = require("../validations/services.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createService(req, res, next) {
  try {
    const { error } = createServiceSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const service = await Service.create({
      ...req.body,
      owner_id: req.user.id, 
    });
    res.status(201).json({ message: "Xizmat yaratildi", service });
  } catch (err) {
    next(err);
  }
}


async function getAllServices(req, res, next) {
  try {
    const {
      name,
      min_price,
      max_price,
      min_duration,
      max_duration,
      sort_by = "name",
      sort_order = "ASC",
    } = req.query;

    const where = {};

    if (name) {
      where.name = {
        [Op.iLike]: `%${name}%`,
      };
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = min_price;
      if (max_price) where.price[Op.lte] = max_price;
    }


    if (min_duration || max_duration) {
      where.duration = {};
      if (min_duration) where.duration[Op.gte] = min_duration;
      if (max_duration) where.duration[Op.lte] = max_duration;
    }

    
    const order = [[sort_by, sort_order]];

    const services = await Service.findAll({
      where,
      order,
    });

    res.json({
      message: "Xizmatlar ro'yxati",
      count: services.length,
      services,
    });
  } catch (err) {
    next(err);
  }
}


async function getServiceById(req, res, next) {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Xizmat topilmadi" });
    }
    res.json({
      message: "Xizmat ma'lumotlari",
      service,
    });
  } catch (err) {
    next(err);
  }
}


async function updateService(req, res, next) {
  try {
    const { error } = updateServiceSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Xizmat topilmadi" });
    }
    await service.update(req.body);
    res.json({ message: "Xizmat yangilandi", service });
  } catch (err) {
    next(err);
  }
}


async function deleteService(req, res, next) {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Xizmat topilmadi" });
    }
    await service.destroy();
    res.json({ message: "Xizmat o'chirildi" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
