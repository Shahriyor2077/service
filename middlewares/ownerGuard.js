const Service = require("../models/services.model");
const { ForbiddenError } = require("../utils/logger");

const ownerGuard = async (req, res, next) => {
  try {
    if (!req.path.startsWith("/api/services")) {
      return next();
    }

    if (req.user.role !== "owner") {
      return next(new ForbiddenError("Faqat egasi bu amalni bajarishi mumkin"));
    }

    if (req.method === "GET" || req.method === "POST") {
      return next();
    }

    const serviceId = req.params.id;
    const service = await Service.findByPk(serviceId);

    if (!service) {
      return next(new ForbiddenError("Xizmat topilmadi"));
    }

    if (service.ownerId.toString() !== req.user._id.toString()) {
      return next(
        new ForbiddenError(
          "Siz faqat o'zingizning xizmatlaringizni boshqarishingiz mumkin"
        )
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = ownerGuard;
