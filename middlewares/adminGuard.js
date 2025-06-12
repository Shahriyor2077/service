function adminGuard(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Faqat adminlar uchun ruxsat" });
}

module.exports = adminGuard;
