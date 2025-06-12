const Technology = require("../models/technologies.model");
const {
  createTechnologySchema,
  updateTechnologySchema,
} = require("../validations/technologies.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createTechnology(req, res) {
  try {
    const { error } = createTechnologySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const technology = await Technology.create(req.body);
    res.status(201).json({ message: "Texnologiya yaratildi", technology });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

async function getAllTechnologies(req, res) {
  try {
    const technologies = await Technology.findAll();
    res.json(technologies);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getTechnologyById(req, res) {
  try {
    const technology = await Technology.findByPk(req.params.id);
    if (!technology) {
      return res.status(404).json({ message: "Texnologiya topilmadi" });
    }
    res.json(technology);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function updateTechnology(req, res) {
  try {
    const { error } = updateTechnologySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const technology = await Technology.findByPk(req.params.id);
    if (!technology) {
      return res.status(404).json({ message: "Texnologiya topilmadi" });
    }
    await technology.update(req.body);
    res.json({ message: "Texnologiya yangilandi", technology });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function deleteTechnology(req, res) {
  try {
    const technology = await Technology.findByPk(req.params.id);
    if (!technology) {
      return res.status(404).json({ message: "Texnologiya topilmadi" });
    }
    await technology.destroy();
    res.json({ message: "Texnologiya o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createTechnology,
  getAllTechnologies,
  getTechnologyById,
  updateTechnology,
  deleteTechnology,
};
