const Transaction = require("../models/transactions.model");
const {
  createTransactionSchema,
  updateTransactionSchema,
} = require("../validations/transactions.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");

async function createTransaction(req, res) {
  try {
    const { error } = createTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ message: "Tranzaksiya yaratildi", transaction });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

async function getAllTransactions(req, res) {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

async function getTransactionById(req, res) {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Tranzaksiya topilmadi" });
    }
    res.json(transaction);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

async function updateTransaction(req, res) {
  try {
    const { error } = updateTransactionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Tranzaksiya topilmadi" });
    }
    await transaction.update(req.body);
    res.json({ message: "Tranzaksiya yangilandi", transaction });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

async function deleteTransaction(req, res) {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Tranzaksiya topilmadi" });
    }
    await transaction.destroy();
    res.json({ message: "Tranzaksiya o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
