const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const teacherSpecializationController = require("../controller/teacherSpecializationController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  teacherSpecializationController.postData
);

router.get("/", auth, teacherSpecializationController.getData);

router.get("/all", auth, teacherSpecializationController.getAllData);

router.get("/:id", auth, teacherSpecializationController.getDataById);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  teacherSpecializationController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  teacherSpecializationController.deleteData
);

module.exports = router;
