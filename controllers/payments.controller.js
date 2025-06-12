const Payment = require("../models/payments.model");
const Transaction = require("../models/transactions.model");
const Order = require("../models/orders.model");
const Service = require("../models/services.model");
const {
  createPaymentSchema,
  updatePaymentSchema,
} = require("../validations/payments.validation");
const { sendErrorResponse } = require("../helpers/send_error_response");


async function createPayment(req, res) {
  try {
    const { error } = createPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const order = await Order.findOne({
      where: { id: req.body.order_id },
      include: [
        {
          model: Service,
          as: "service",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    if (req.user.role === "client" && order.client_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bu buyurtma sizga tegishli emas" });
    }

    if (req.user.role === "owner" && order.service.owner_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bu buyurtma sizga tegishli emas" });
    }

    const payment = await Payment.create(req.body);
    res.status(201).json({ message: "To'lov yaratildi", payment });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getAllPayments(req, res) {
  try {
    let payments;
    if (req.user.role === "client") {
      // Mijoz faqat o'z to'lovlarini ko'ra oladi
      payments = await Payment.findAll({
        include: [
          {
            model: Order,
            where: { client_id: req.user.id },
          },
        ],
      });
    } else if (req.user.role === "owner") {
      payments = await Payment.findAll({
        include: [
          {
            model: Order,
            include: [
              {
                model: Service,
                where: { owner_id: req.user.id },
              },
            ],
          },
        ],
      });
    } else {
      // Admin barcha to'lovlarni ko'ra oladi
      payments = await Payment.findAll();
    }
    res.json(payments);
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function getPaymentById(req, res) {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          include: [
            {
              model: Service,
            },
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: "To'lov topilmadi" });
    }

    if (req.user.role === "client" && payment.order.client_id !== req.user.id) {
      return res.status(403).json({ message: "Bu to'lov sizga tegishli emas" });
    }
    if (
      req.user.role === "owner" &&
      payment.order.service.owner_id !== req.user.id
    ) {
      return res.status(403).json({ message: "Bu to'lov sizga tegishli emas" });
    }

    const transaction = await Transaction.findOne({
      where: {
        client_id: payment.order.client_id,
        amount: payment.amount,
        type: "deposit",
      },
    });

    res.json({
      ...payment.toJSON(),
      transaction_exists: !!transaction,
    });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

async function updatePayment(req, res) {
  try {
    const { error } = updatePaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          include: [
            {
              model: Service,
            },
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: "To'lov topilmadi" });
    }

    if (payment.order.service.owner_id !== req.user.id) {
      return res.status(403).json({ message: "Bu to'lov sizga tegishli emas" });
    }

    if (req.body.status === "completed") {
      const existingTransaction = await Transaction.findOne({
        where: {
          client_id: payment.order.client_id,
          amount: payment.amount,
          type: "deposit",
        },
      });

      if (!existingTransaction) {

        await Transaction.create({
          client_id: payment.order.client_id,
          type: "deposit",
          amount: payment.amount,
          description: `To'lov tasdiqlandi: ${payment.id}`,
        });
      }
    }

    await payment.update(req.body);

    const transaction = await Transaction.findOne({
      where: {
        client_id: payment.order.client_id,
        amount: payment.amount,
        type: "deposit",
      },
    });

    res.json({
      message: "To'lov yangilandi",
      payment,
      transaction_exists: !!transaction,
    });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}


async function deletePayment(req, res) {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "To'lov topilmadi" });
    }
    await payment.destroy();
    res.json({ message: "To'lov o'chirildi" });
  } catch (err) {
    sendErrorResponse(err, res);
  }
}

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
