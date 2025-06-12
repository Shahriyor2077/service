const nodemailer = require("nodemailer");
const config = require("config");

const transporter = nodemailer.createTransport({
  service: config.get("email.service"),
  auth: {
    user: config.get("email.user"),
    pass: config.get("email.pass"),
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    if (!to) {
      throw new Error("Email recipient is required");
    }

    const mailOptions = {
      from: config.get("email.user"),
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
