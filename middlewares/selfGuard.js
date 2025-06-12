function selfGuard(param = "id") {
  return (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "owner")) {
      return next();
    }
    if (
      req.user &&
      req.user.id &&
      req.params[param] &&
      String(req.user.id) === String(req.params[param])
    ) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "Faqat o'zingizga tegishli ma'lumot uchun ruxsat" });
  };
}

module.exports = selfGuard;
