const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const examScheduleController = require("../controller/examScheduleController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  examScheduleController.postData
);

router.get("/", auth, checkUserRole(["admin"]), examScheduleController.getData);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  examScheduleController.getAlldata
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  examScheduleController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  examScheduleController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  examScheduleController.deleteData
);

module.exports = router;
