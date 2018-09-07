const requireLogin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next();
};

// @desc 0=Player 1=Crew Jr 2=Crew Leader 3=TO 4=Admin
// @params role : array(int)
const requireRole = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return res.status(401).json({ error: "User does not have permission" });
    }
    next();
  };
}

module.exports = {
  requireLogin,
  requireRole
};
