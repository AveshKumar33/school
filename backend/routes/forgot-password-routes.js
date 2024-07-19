const express = require("express");
const router = express.Router();

const otpController = require("../controller/forgot-password-controller");

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/change-password", otpController.changePassword);

module.exports = router;
