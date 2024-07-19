const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const attendanceController = require("../controller/staffAttendanceController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  attendanceController.updateAttendance
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  attendanceController.getAttendance
);

module.exports = router;
