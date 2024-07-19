const jwt = require("jsonwebtoken");

const UserTypeHandler = (req, res, next) => {
  try {
    let userType;

    const cookieNames = ["admin", "teacher", "student"];

    for (const cookieName of cookieNames) {
      const cookie = req.cookies[cookieName];
      if (cookie) {
        userType = jwt.verify(cookie, process.env.SECRET_KEY).userType;
        break;
      }
    }

    if (!userType) {
      const error = new Error("Unauthorized!");
      error.statusCode = 401;
      throw error;
    }

    req.userType = userType;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = UserTypeHandler;
