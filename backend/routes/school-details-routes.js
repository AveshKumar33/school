const express = require("express");
const router = express.Router();

const uploadMany = require("../middleware/file-upload");
const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const schoolDetailsController = require("../controller/schoolDetailsController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  uploadMany,
  schoolDetailsController.postData
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  schoolDetailsController.getSchoolDetails
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  uploadMany,
  schoolDetailsController.updateData
);
// router.delete("/", auth, assignmentController.deletAssignemet);
// router.get("/file/:filename", auth, assignmentController.viewAssignment);

module.exports = router;
