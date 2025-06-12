function roleGuard(roles = []) {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Ruxsat etilmagan foydalanuvchi roli" });
  };
}

module.exports = roleGuard;
