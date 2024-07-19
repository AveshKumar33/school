const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const CourseTypeController = require("../controller/CourseTypeController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  CourseTypeController.postCourseType
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  CourseTypeController.getCourseType
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  CourseTypeController.getAllCourseType
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  CourseTypeController.updateCourseType
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  CourseTypeController.deleteCourseType
);

module.exports = router;
