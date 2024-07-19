const { connections } = require("../database/config");
const Session = require("../schema/session-model");
const sessionSchema = require("../schema/session-year-schema");
const AdminAuthSchema = require("../schema/admin-schema");
const employeeSchema = require("../schema/employee-schema");
const studentSchema = require("../schema/Student-schema");
const designationSchema = require("../schema/designation-schema");
const jwt = require("jsonwebtoken");

const option = {
  httpOnly: true,
  maxAge: 1 * 24 * 60 * 60 * 1000,
};

const loginUser = async (req, res, next) => {
  try {
    const sessionData = await new Promise((resolve, reject) => {
      Session.activeSession((sessions) => {
        resolve(sessions);
      });
    });

    const admin_model = connections[sessionData?.name].model(
      "admin",
      AdminAuthSchema
    );

    const sessionModel = connections[sessionData?.name].model(
      "session",
      sessionSchema
    );

    const student_model = connections[sessionData?.name].model(
      "student",
      studentSchema
    );

    const employee_model = connections[sessionData?.name].model(
      "employee",
      employeeSchema
    );

    connections[sessionData?.name].model("designation", designationSchema);

    const { userType } = req.body;

    let userId, password;
    let user;

    if (userType) {
      switch (userType) {
        case "admin":
          userId = req.body.email;
          password = req.body.password;
          user = await admin_model.findOne({ email: userId });
          break;
        case "teacher":
          userId = req.body.teacherId;
          password = req.body.password;
          user = await employee_model.findOne({ employeeNo: userId }).populate([
            {
              path: "designation",
              select: "title",
            },
          ]);
          break;
        case "student":
          userId = req.body.rollNo;
          password = req.body.password;
          user = await student_model.findOne({ rollNo: userId });
          break;
        default:
          const error = new Error("Unknown user type!");
          error.statusCode = 401;
          throw error;
      }

      if (user) {
        const currentSession = await sessionModel.findOne();

        if (user.password === password) {
          const token = jwt.sign(
            {
              id: user?._id,
              userType: userType,
              sessionId: currentSession?._id || sessionData?._id,
              sessionYear: currentSession?.name || sessionData?.name,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "4h",
            }
          );

          res.cookie(userType, token, option).send({
            status: "success",
            message: "login success",
            user: user,
            userType: userType,
          });
        } else {
          const error = new Error("Invalid email or password");
          error.statusCode = 401;
          throw error;
        }
      } else {
        const error = new Error("User does not exist");
        error.statusCode = 401;
        throw error;
      }
    } else {
      const error = new Error("All fields are required");
      error.statusCode = 422;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res, next) => {
  try {
    const userType = req.query.user;
    res.clearCookie(userType);
    res.json({ status: "success", message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, logoutUser };
