const mongoose = require("mongoose");
const mail = require("../utils/nodemailer");

const otpSchema = new mongoose.Schema({
  verificationId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["admin", "student", "teacher"],
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // 5 minutes of its creation time
  },
});

otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await mail(this.email, "Verification Email", this.otp);
  }
  next();
});

// module.exports = mongoose.model("OTP", otpSchema);
module.exports = otpSchema;
