const { Op } = require("sequelize");
const Service = require("../models/services.model");
const Client = require("../models/clients.model");
const Order = require("../models/orders.model");
const Payment = require("../models/payments.model");
const { Services, Order: OrderAssociation } = require("../models/associations");
const {
  getServicesByDateRangeSchema,
  getClientsByDateRangeSchema,
} = require("../validations/filters.validation");
const sequelize = require("sequelize");

// 1. Berilgan vaqt oralig'ida foydalanilgan xizmatlar ro'yxatini chiqarish
const getServicesByDateRange = async (req, res) => {
  try {
    // Validatsiya
    const { error } = getServicesByDateRangeSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: "Validatsiya xatosi",
        error: error.details[0].message,
      });
    }

    const { start_date, end_date } = req.query;

    // 1. Avval statistika ma'lumotlarini olish
    const serviceStats = await Services.findAll({
      include: [
        {
          model: Order,
          as: "service_orders",
          required: true,
          where: {
            order_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "name",
        "price",
        "duration",
        "description",
        [
          sequelize.fn("COUNT", sequelize.col("service_orders.id")),
          "total_orders",
        ],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("service_orders.client_id"))
          ),
          "unique_clients",
        ],
        [
          sequelize.literal("COUNT(service_orders.id) * services.price"),
          "total_amount",
        ],
      ],
      group: ["services.id"],
    });

    // 2. Keyin buyurtmalar ma'lumotlarini olish
    const services = await Services.findAll({
      include: [
        {
          model: Order,
          as: "service_orders",
          required: true,
          where: {
            order_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
      ],
      attributes: ["id", "name", "price", "duration", "description"],
    });

    // 3. Natijalarni birlashtirish
    const formattedServices = services.map((service) => {
      const stats = serviceStats.find((stat) => stat.id === service.id);
      return {
        id: service.id,
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description,
        statistics: {
          total_orders: parseInt(stats?.getDataValue("total_orders")) || 0,
          unique_clients: parseInt(stats?.getDataValue("unique_clients")) || 0,
          total_amount: parseFloat(stats?.getDataValue("total_amount")) || 0,
        },
        orders: service.service_orders.map((order) => ({
          id: order.id,
          order_date: order.order_date,
          status: order.status,
          client: order.client,
        })),
      };
    });

    res.json({
      message: "Muvaffaqiyatli",
      period: {
        start_date,
        end_date,
      },
      total_services: formattedServices.length,
      services: formattedServices,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({
      message: "Server xatosi",
      error: error.message,
    });
  }
};

// 2. Berilgan vaqt oralig'ida xizmatdan foydalangan Clientlar ro'yxatini chiqarish
const getClientsByDateRange = async (req, res) => {
  try {
    // Validatsiya
    const { error } = getClientsByDateRangeSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        message: "Validatsiya xatosi",
        error: error.details[0].message,
      });
    }

    const { start_date, end_date } = req.query;

    // 1. Avval statistika ma'lumotlarini olish
    const clientStats = await Client.findAll({
      include: [
        {
          model: Order,
          as: "orders",
          required: true,
          where: {
            order_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          include: [
            {
              model: Services,
              as: "service",
              attributes: ["price"],
            },
          ],
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "name",
        "email",
        "phone",
        [sequelize.fn("COUNT", sequelize.col("orders.id")), "total_orders"],
        [sequelize.literal('SUM("orders->service".price)'), "total_amount"],
      ],
      group: [
        "clients.id",
        "clients.name",
        "clients.email",
        "clients.phone",
        '"orders->service".id',
      ],
    });

    // 2. Keyin buyurtmalar ma'lumotlarini olish
    const clients = await Client.findAll({
      include: [
        {
          model: Order,
          as: "orders",
          required: true,
          where: {
            order_date: {
              [Op.between]: [start_date, end_date],
            },
          },
          include: [
            {
              model: Services,
              as: "service",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
      attributes: ["id", "name", "email", "phone"],
    });

    // 3. Natijalarni birlashtirish
    const formattedClients = clients.map((client) => {
      const stats = clientStats.find((stat) => stat.id === client.id);
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        statistics: {
          total_orders: parseInt(stats?.getDataValue("total_orders")) || 0,
          total_amount: parseFloat(stats?.getDataValue("total_amount")) || 0,
        },
        orders: client.orders.map((order) => ({
          id: order.id,
          order_date: order.order_date,
          status: order.status,
          service: order.service,
        })),
      };
    });

    res.json({
      message: "Muvaffaqiyatli",
      period: {
        start_date,
        end_date,
      },
      total_clients: formattedClients.length,
      clients: formattedClients,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({
      message: "Server xatosi",
      error: error.message,
    });
  }
};

// 3. Berilgan vaqt oralig'ida xizmatni bekor qilgan Clientlar ro'yxatini chiqarish
async function getCancelledClientsByDateRange(req, res) {
  try {
    const { start_date, end_date } = req.query;

    const clients = await Client.findAll({
      include: [
        {
          model: Order,
          as: "orders",
          where: {
            order_date: {
              [Op.between]: [start_date, end_date],
            },
            status: "cancelled",
          },
        },
      ],
    });

    res.json({
      message:
        "Berilgan vaqt oralig'ida xizmatni bekor qilgan mijozlar ro'yxati",
      clients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 4. Berilgan xizmat nomi bo'yicha eng ko'p bajargan Ownerlar ro'yxatini chiqarish
async function getTopOwnersByService(req, res) {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        message: "Xizmat nomi kiritilmagan",
      });
    }

    const service = await Services.findOne({
      where: {
        name: {
          [Op.iLike]: name,
        },
      },
      include: [
        {
          model: Order,
          as: "service_orders",
          include: [
            {
              model: Payment,
              as: "payments",
            },
          ],
        },
      ],
    });

    if (!service) {
      return res.status(404).json({
        message: "Xizmat topilmadi",
        service_name: name,
      });
    }

    // Ownerlarni to'lovlar soni bo'yicha saralash
    const owners = service.service_orders.reduce((acc, order) => {
      const ownerId = order.owner_id;
      if (!acc[ownerId]) {
        acc[ownerId] = {
          owner_id: ownerId,
          total_payments: 0,
          total_orders: 0,
          completed_payments: 0,
        };
      }
      acc[ownerId].total_payments += order.payments.length;
      acc[ownerId].total_orders += 1;
      acc[ownerId].completed_payments += order.payments.filter(
        (p) => p.status === "completed"
      ).length;
      return acc;
    }, {});

    const sortedOwners = Object.values(owners).sort(
      (a, b) => b.completed_payments - a.completed_payments
    );

    res.json({
      message: "Xizmat bo'yicha eng ko'p bajargan egasilar ro'yxati",
      service_name: service.name,
      total_owners: sortedOwners.length,
      owners: sortedOwners,
    });
  } catch (error) {
    console.error("Xatolik:", error);
    res.status(500).json({
      message: "Server xatosi",
      error: error.message,
    });
  }
}

// 5. Berilgan Client ma'lumotlari asosida qaysi xizmatga (ownerni ko'rsatgan holda) amalga oshirilgan Paymentlar ro'yxatini chiqarish
async function getClientPaymentsByService(req, res) {
  try {
    const { client_id } = req.params;

    const client = await Client.findByPk(client_id, {
      include: [
        {
          model: Order,
          as: "orders",
          include: [
            {
              model: Service,
              as: "service",
            },
            {
              model: Payment,
              as: "payments",
              where: {
                status: "completed",
              },
            },
          ],
        },
      ],
    });

    if (!client) {
      return res.status(404).json({ message: "Mijoz topilmadi" });
    }

    const payments = client.orders.map((order) => ({
      service_name: order.service.name,
      owner_id: order.owner_id,
      payments: order.payments,
    }));

    res.json({
      message: "Mijozning xizmatlar bo'yicha to'lovlari ro'yxati",
      client_name: client.name,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getServicesByDateRange,
  getClientsByDateRange,
  getCancelledClientsByDateRange,
  getTopOwnersByService,
  getClientPaymentsByService,
};
