const jwt = require("jsonwebtoken");
const config = require("config");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token talab qilinadi" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.get("jwt.secret"));
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token muddati tugagan" });
    }
    return res.status(401).json({ message: "Yaroqsiz token" });
  }
}

module.exports = authMiddleware;
