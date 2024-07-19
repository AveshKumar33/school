const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const ExamTypeController = require("../controller/ExamTypeController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  ExamTypeController.postExamType
);

router.get("/", auth, checkUserRole(["admin"]), ExamTypeController.getExamType);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  ExamTypeController.getAllExamType
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  ExamTypeController.updateExamType
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  ExamTypeController.deleteExamType
);

module.exports = router;
