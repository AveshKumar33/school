const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const teachingTypeController = require("../controller/teachingTypeController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  teachingTypeController.postData
);

router.get("/", auth, teachingTypeController.getData);

router.get("/all", auth, teachingTypeController.getAllData);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  teachingTypeController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  teachingTypeController.deleteData
);

module.exports = router;
