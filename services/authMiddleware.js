const requireLogin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};

const requireCrewLeader = (req, res, next) => {
  if (req.user.role != 1) {
    return res.status(401).json({ error: "User is not a Crew Leader" });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role != 2) {
    return res.status(401).json({ error: "User is not an Admin" });
  }
  next();
};

module.exports = {
  requireLogin,
  requireCrewLeader,
  requireAdmin
};
