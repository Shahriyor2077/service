const Client = require("../models/clients.model");
const {
  createClientSchema,
  updateClientSchema,
} = require("../validations/clients.validation");


async function createClient(req, res, next) {
  try {
    const { error } = createClientSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const client = await Client.create(req.body);
    res.status(201).json({ message: "Mijoz yaratildi", client });
  } catch (err) {
    next(err);
  }
}


async function getAllClients(req, res, next) {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    next(err);
  }
}


async function getClientById(req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Mijoz topilmadi" });
    }
    res.json(client);
  } catch (err) {
    next(err);
  }
}


async function updateClient(req, res, next) {
  try {
    const { error } = updateClientSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Mijoz topilmadi" });
    }
    await client.update(req.body);
    res.json({ message: "Mijoz yangilandi", client });
  } catch (err) {
    next(err);
  }
}


async function deleteClient(req, res, next) {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Mijoz topilmadi" });
    }
    await client.destroy();
    res.json({ message: "Mijoz o'chirildi" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};
