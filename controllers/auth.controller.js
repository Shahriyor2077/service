const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Op } = require("sequelize");
const Admin = require("../models/admin.model");
const Client = require("../models/clients.model");
const {
  createAdminSchema,
  updateAdminSchema,
  loginAdminSchema,
} = require("../validations/admin.validation");
const {
  createClientSchema,
  updateClientSchema,
  loginClientSchema,
} = require("../validations/clients.validation");
// const { sendErrorResponse } = require("../helpers/send_error_response");
const sendEmail = require("../helpers/send_email");
const { generateTokens } = require("../helpers/generate_tokens");


const adminRegister = async (req, res, next) => {
  try {
    const { error } = createAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { name, email, password, role } = req.body;

    // Email mavjudligini tekshirish
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }


    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

   
    const admin = await Admin.create({
      name,
      email,
      password_hash,
      role,
      is_active: role === "owner" ? false : true, 
    });

    // Agar owner bo'lsa, aktivatsiya emaili yuborish
    if (role === "owner") {
      const activationToken = jwt.sign(
        { id: admin.id, email: admin.email },
        config.get("jwt.secret"),
        { expiresIn: "24h" }
      );

      const activationLink = `${config.get(
        "clientUrl"
      )}/activate-owner/${activationToken}`;
      await sendEmail({
        to: admin.email,
        subject: "Owner akkauntini aktivlashtirish",
        text: `Akkountingizni aktivlashtirish uchun quyidagi havolani bosing: ${activationLink}`,
      });
    }

    
    const { accessToken, refreshToken } = generateTokens(admin.id, admin.role);

    res.status(201).json({
      message: "Admin muvaffaqiyatli ro'yxatdan o'tdi",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


const adminLogin = async (req, res, next) => {
  try {
    const { error } = loginAdminSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { email, password } = req.body;


    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }

    const { accessToken, refreshToken } = generateTokens(admin.id, admin.role);

    admin.refreshToken = refreshToken;
    admin.refreshToken_expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); 
    await admin.save();

    res.json({
      message: "Admin muvaffaqiyatli kirdi",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};



const adminLogout = async (req, res, next) => {
  try {
    const admin = await Admin.findByPk(req.user.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin topilmadi" });
    }

    admin.refreshToken = null;
    admin.refreshToken_expires_at = null;
    await admin.save();

    res.json({ message: "Admin muvaffaqiyatli chiqdi" });
  } catch (error) {
    next(error);
  }
};


const adminRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token kiritilmagan" });
    }

    const admin = await Admin.findOne({
      where: {
        refreshToken,
        refreshToken_expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!admin) {
      return res
        .status(401)
        .json({ message: "Yaroqsiz yoki muddati tugagan refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      admin.id,
      admin.role
    );

    admin.refreshToken = newRefreshToken;
    admin.refreshToken_expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); 
    await admin.save();

    res.json({
      message: "Token yangilandi",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};


const clientRegister = async (req, res, next) => {
  try {
    const { error } = createClientSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { name, email, password, phone } = req.body;

  
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res
        .status(400)
        .json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    // Parolni hash qilish
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Aktivatsiya tokeni yaratish
    const activationToken = jwt.sign({ email }, config.get("jwt.secret"), {
      expiresIn: "24h",
    });

    
    const client = await Client.create({
      name,
      email,
      password_hash,
      phone,
      is_active: false,
      activation_token: activationToken,
    });


    const activationLink = `${config.get(
      "clientUrl"
    )}/activate/${activationToken}`;
    await sendEmail({
      to: client.email,
      subject: "Akkountingizni aktivlashtirish",
      text: `Akkountingizni aktivlashtirish uchun quyidagi havolani bosing: ${activationLink}`,
    });

    res.status(201).json({
      message:
        "Mijoz muvaffaqiyatli ro'yxatdan o'tdi.Emailingizni tekshiring",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const clientLogin = async (req, res, next) => {
  try {
    const { error } = loginClientSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { email, password } = req.body;


    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }


    const isMatch = await bcrypt.compare(password, client.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }


    const { accessToken, refreshToken } = generateTokens(client.id, "client");


    client.refreshToken = refreshToken;
    client.refreshToken_expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); 
    await client.save();

    res.json({
      message: "Mijoz muvaffaqiyatli kirdi",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};


const clientLogout = async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.user.id);
    if (!client) {
      return res.status(404).json({ message: "Mijoz topilmadi" });
    }

    client.refreshToken = null;
    client.refreshToken_expires_at = null;
    await client.save();

    res.json({ message: "Mijoz muvaffaqiyatli chiqdi" });
  } catch (error) {
    next(error);
  }
};


const clientRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token kiritilmagan" });
    }

    const client = await Client.findOne({
      where: {
        refreshToken,
        refreshToken_expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!client) {
      return res
        .status(401)
        .json({ message: "Yaroqsiz yoki muddati tugagan refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      client.id,
      "client"
    );

    client.refreshToken = newRefreshToken;
    client.refreshToken_expires_at = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); 
    await client.save();

    res.json({
      message: "Token yangilandi",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
};


const clientActivate = async (req, res, next) => {
  try {
    const { token } = req.params;


    const decoded = jwt.verify(token, config.get("jwt.secret"));
    if (!decoded) {
      return res.status(400).json({ message: "Yaroqsiz token" });
    }


    const client = await Client.findOne({
      where: {
        email: decoded.email,
        activation_token: token,
        is_active: false,
      },
    });

    if (!client) {
      return res
        .status(404)
        .json({ message: "Mijoz topilmadi yoki allaqachon aktivlashtirilgan" });
    }


    client.is_active = true;
    client.activation_token = null;
    await client.save();

    res.json({ message: "Mijoz muvaffaqiyatli aktivlashtirildi" });
  } catch (error) {
    next(error);
  }
};


const ownerActivate = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Tokenni tekshirish
    const decoded = jwt.verify(token, config.get("jwt.secret"));
    if (!decoded) {
      return res.status(400).json({ message: "Yaroqsiz token" });
    }


    const admin = await Admin.findOne({
      where: {
        id: decoded.id,
        email: decoded.email,
        role: "owner",
        is_active: false,
      },
    });

    if (!admin) {
      return res
        .status(404)
        .json({ message: "Owner topilmadi yoki allaqachon aktivlashtirilgan" });
    }


    admin.is_active = true;
    await admin.save();

    res.json({ message: "Owner muvaffaqiyatli aktivlashtirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  adminLogout,
  adminRefreshToken,
  ownerActivate,
  clientRegister,
  clientLogin,
  clientLogout,
  clientRefreshToken,
  clientActivate,
};
