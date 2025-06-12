const ServiceTechnology = require("../models/service_technology.model");
const {
  createServiceTechnologySchema,
} = require("../validations/service_technology.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createServiceTechnology(req, res) {
  try {
    const { error } = createServiceTechnologySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const st = await ServiceTechnology.create(req.body);
    res.status(201).json({ message: "Xizmat va texnologiya bog'landi", st });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getAllServiceTechnologies(req, res) {
  try {
    const sts = await ServiceTechnology.findAll();
    res.json(sts);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getServiceTechnologyById(req, res) {
  try {
    const st = await ServiceTechnology.findOne({
      where: {
        service_id: req.params.service_id,
        technology_id: req.params.technology_id,
      },
    });
    if (!st) {
      return res.status(404).json({ message: "Bog'lanish topilmadi" });
    }
    res.json(st);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function deleteServiceTechnology(req, res) {
  try {
    const st = await ServiceTechnology.findOne({
      where: {
        service_id: req.params.service_id,
        technology_id: req.params.technology_id,
      },
    });
    if (!st) {
      return res.status(404).json({ message: "Bog'lanish topilmadi" });
    }
    await st.destroy();
    res.json({ message: "Bog'lanish o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createServiceTechnology,
  getAllServiceTechnologies,
  getServiceTechnologyById,
  deleteServiceTechnology,
};
