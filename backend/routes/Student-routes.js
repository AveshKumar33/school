const express = require("express");
const uploadMany = require("../middleware/file-upload");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postManyStudent,
  postStudent,
  getStudent,
  getAllStudent,
  getAllStudentName,
  getStudentById,
  getStudentCount,
  updateStudent,
  studentActiveInActive,
  deleteStudent,
} = require("../controller/Student-controller");

router.post("/all", auth, checkUserRole(["admin"]), postManyStudent);

router.post("/", auth, checkUserRole(["admin"]), uploadMany, postStudent);

router.get("/", auth, getStudent);

router.get("/allstudent", auth, getAllStudent);

router.get("/count", auth, getStudentCount);

router.get("/name", auth, getAllStudentName);

router.get("/:id", auth, checkUserRole(["admin"]), getStudentById);

router.put(
  "/status/:id",
  auth,
  checkUserRole(["admin"]),
  studentActiveInActive
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin", "student"]),
  uploadMany,
  updateStudent
);

router.delete("/:id", auth, checkUserRole(["admin"]), deleteStudent);

module.exports = router;
