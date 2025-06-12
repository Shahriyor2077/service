function creatorGuard(getCreatorId) {
  return async (req, res, next) => {
    try {
      const creatorId = await getCreatorId(req);
      if (
        req.user &&
        req.user.id &&
        String(req.user.id) === String(creatorId)
      ) {
        return next();
      }
      if (
        req.user &&
        (req.user.role === "admin" || req.user.role === "owner")
      ) {
        return next();
      }
      return res
        .status(403)
        .json({ message: "Faqat resurs egasi yoki admin/owner uchun ruxsat" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Creator guard xatosi", error: err.message });
    }
  };
}

module.exports = creatorGuard;
