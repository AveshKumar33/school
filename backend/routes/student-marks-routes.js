const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const studentMarksController = require("../controller/studentMarksController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  studentMarksController.postMarks
);

// router.get(
//   "/",
//   auth,
//   checkUserRole(["admin"]),
//   studentMarksController.getMarks
// );

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  studentMarksController.getAllMarks
);

module.exports = router;
