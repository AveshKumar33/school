const { connections } = require("../database/config");
const AdminAuthSchema = require("../schema/admin-schema");
const employeeSchema = require("../schema/employee-schema");
const studentSchema = require("../schema/Student-schema");
const otpSchema = require("../schema/otp-schema");

const generateOtp = require("../utils/generateOTP");

exports.sendOTP = async (req, res, next) => {
  try {
    let { userType, email, verificationId } = req.body;
    let user = null;

    const admin_model = connections[req.currentSessionYear].model(
      "admin",
      AdminAuthSchema
    );

    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const otp_model = connections[req.currentSessionYear].model(
      "OTP",
      otpSchema
    );

    if (userType) {
      switch (userType) {
        case "admin":
          verificationId = email;
          user = await admin_model.findOne({ email: email });
          break;
        case "teacher":
          user = await employee_model.findOne({ employeeNo: verificationId });
          break;
        case "student":
          user = await student_model.findOne({ rollNo: verificationId });
          break;
        default:
          const error = new Error("Unknown user type!");
          error.statusCode = 401;
          throw error;
      }

      if (user) {
        if (user.email === email) {
          let otp = generateOtp();

          // let result = await otp_model.findOne({ otp: otp });
          // while (result) {
          //   otp = generateOtp();
          //   result = await otp_model.findOne({ otp: otp });
          // }

          const otpPayload = { verificationId, email, userType, otp };

          const otpBody = await otp_model.create(otpPayload);

          res.status(201).send({
            status: "Success",
            verificationId: verificationId,
            step: "otp",
            message: "OTP sent successfully!",
          });
        } else {
          const error = new Error("Invalid email!");
          error.statusCode = 401;
          throw error;
        }
      } else {
        const error = new Error("User not found!");
        error.statusCode = 401;
        throw error;
      }
    } else {
      const error = new Error("Please select user type!");
      error.statusCode = 422;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

// otp verification controller

exports.verifyOTP = async (req, res, next) => {
  try {
    const { verificationId, otp } = req.body;

    const otp_model = connections[req.currentSessionYear].model(
      "OTP",
      otpSchema
    );

    if (!verificationId || !otp) {
      res.status(201).send({
        verificationId: verificationId,
        status: "Failed",
        message: "All fields are required!!",
      });
    }

    const response = await otp_model
      .find({ verificationId: verificationId })
      .sort({ createdAt: -1 })
      .limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      res.status(201).send({
        verificationId: verificationId,
        status: "Failed",
        message: "Invalid OTP!",
      });
    } else if (response[0].otp === otp) {
      res.status(201).send({
        verificationId: verificationId,
        status: "Success",
        nxtStep: "passwordStep",
        message: "OTP Verified!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    let { userType, password, verificationId } = req.body;
    let user = null;

    const admin_model = connections[req.currentSessionYear].model(
      "admin",
      AdminAuthSchema
    );

    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    if (userType) {
      switch (userType) {
        case "admin":
          user = await admin_model.findOne({ email: verificationId });
          break;
        case "teacher":
          user = await employee_model.findOne({ employeeNo: verificationId });
          break;
        case "student":
          user = await student_model.findOne({ rollNo: verificationId });
          break;
        default:
          const error = new Error("Unknown user type!");
          error.statusCode = 401;
          throw error;
      }

      if (user) {
        user.password = password;

        await user.save();

        res.status(201).send({
          status: "Success",
          message: "Password updated successfully!",
        });
      } else {
        const error = new Error("User not found!");
        error.statusCode = 401;
        throw error;
      }
    } else {
      const error = new Error("Please select user type!");
      error.statusCode = 422;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
