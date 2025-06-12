const sendErrorResponse = (error, res) => {

  if (!error) {
    return res.status(500).json({
      message: "Serverda kutilmagan xatolik yuz berdi",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : "Xatolik ma'lumotlari yo'q",
    });
  }

  console.log("Error:", error);

  if (error.isJoi && error.details) {
    return res.status(400).json({
      message: "Validatsiya xatosi",
      errors: error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }


  if (error.name === "SequelizeValidationError" && error.errors) {
    return res.status(400).json({
      message: "Validatsiya xatosi",
      errors: error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }


  if (error.name === "SequelizeUniqueConstraintError" && error.errors) {
    return res.status(409).json({
      message: "Bu ma'lumot allaqachon mavjud",
      errors: error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }


  if (error.name === "SequelizeForeignKeyConstraintError" && error.errors) {
    return res.status(400).json({
      message: "Bog'langan ma'lumot topilmadi",
      errors: error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }


  if (error.name === "SequelizeRecordNotFoundError") {
    return res.status(404).json({
      message: "Ma'lumot topilmadi",
    });
  }


  if (error.name === "SequelizeConnectionError") {
    return res.status(503).json({
      message: "Ma'lumotlar bazasi bilan bog'lanishda xatolik",
      error: process.env.NODE_ENV === "production" ? undefined : error.message,
    });
  }


  res.status(500).json({
    message: "Serverda kutilmagan xatolik yuz berdi",
    error:
      process.env.NODE_ENV === "production"
        ? undefined
        : error.message || "Xatolik haqida ma'lumot yo'q",
  });
};

module.exports = {
  sendErrorResponse,
};
