const jwt = require("jsonwebtoken");
const { connections } = require("../database/config");
const AdminAuthSchema = require("../schema/admin-schema");
const Session = require("../schema/session-model");
const employeeSchema = require("../schema/employee-schema");
const studentSchema = require("../schema/Student-schema");
const sessionSchema = require("../schema/session-year-schema");

let auth = async (req, res, next) => {
  let tokenName = req.userType;

  try {
    const token = req.cookies[tokenName];

    if (!token) {
      const error = new Error("Unauthorized! Please login.");
      error.statusCode = 401;
      throw error;
    }

    const { id, userType, sessionId, sessionYear } = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    const admin_model = connections[sessionYear].model(
      "admin",
      AdminAuthSchema
    );

    const student_model = connections[sessionYear].model(
      "student",
      studentSchema
    );

    const employee_model = connections[sessionYear].model(
      "employee",
      employeeSchema
    );

    connections[sessionYear].model("session", sessionSchema);

    // const currentSession = await sessionModel.findOne();

    // console.log("currentSession", currentSession);

    const sessionData = await new Promise((resolve, reject) => {
      Session.activeSession((sessions) => {
        resolve(sessions);
      });
    });

    let user;

    if (userType === "admin") {
      user = await admin_model.findOne({ _id: id });
    } else if (userType === "teacher") {
      user = await employee_model.findOne({ _id: id });
    } else if (userType === "student") {
      user = await student_model.findOne({ _id: id });
    }

    if (user) {
      req.user = user;
      req.userType = userType;
      req.currentSession = sessionData._id;
      req.currentSessionYear = sessionData.name;
      next();
    } else {
      const error = new Error("Unauthorized! Unknown user.");
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = auth;
