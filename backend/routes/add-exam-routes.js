const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const AddExamController = require("../controller/AddExamController");

router.post("/", auth, checkUserRole(["admin"]), AddExamController.postExam);

router.get("/", auth, checkUserRole(["admin"]), AddExamController.getExam);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  AddExamController.getAllExam
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  AddExamController.updateExam
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  AddExamController.deleteExam
);

module.exports = router;
