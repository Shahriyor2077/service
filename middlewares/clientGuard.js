function clientGuard(req, res, next) {
  if (req.user && req.user.role === "client") {
    return next();
  }
  return res.status(403).json({ message: "Faqat clientlar uchun ruxsat" });
}

module.exports = clientGuard;
