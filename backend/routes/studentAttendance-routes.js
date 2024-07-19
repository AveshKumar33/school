const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const studentAttendanceController = require("../controller/studentAttendanceController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  studentAttendanceController.updateAttendance
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  studentAttendanceController.getAttendance
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  studentAttendanceController.getAllAttendance
);

module.exports = router;
