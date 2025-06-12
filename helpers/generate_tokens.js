const jwt = require("jsonwebtoken");
const config = require("config");

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    config.get("jwt.secret"),
    { expiresIn: "3d" } 
  );

  const refreshToken = jwt.sign(
    { id: userId, role },
    config.get("jwt.refresh_secret"), 
    { expiresIn: "7d" } 
  );

  return { accessToken, refreshToken };
};

module.exports = {
  generateTokens,
};
