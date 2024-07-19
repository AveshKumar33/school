const checkUserRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.userType;

    if (roles.includes(userRole)) {
      next();
    } else {
      const error = new Error("Unauthorized! Please Login.");
      error.statusCode = 401;
      throw error;
    }
  };
};

module.exports = checkUserRole;
