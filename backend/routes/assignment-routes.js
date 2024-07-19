const express = require("express");
const router = express.Router();

const uploadMany = require("../middleware/file-upload");
const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const assignmentController = require("../controller/assignment-controller");

router.post(
  "/",
  auth,
  checkUserRole(["teacher"]),
  uploadMany,
  assignmentController.postAssignment
);

router.get("/", auth, assignmentController.getAssignment);
router.get("/:id", auth, assignmentController.getAssignmentById);
router.delete("/", auth, assignmentController.deletAssignemet);
router.get("/file/:filename", auth, assignmentController.viewAssignment);

module.exports = router;
