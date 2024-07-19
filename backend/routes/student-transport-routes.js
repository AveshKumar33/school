const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const studentTransportController = require("../controller/studentTransportController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  studentTransportController.postData
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  studentTransportController.getData
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  studentTransportController.getAlldata
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  studentTransportController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  studentTransportController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  studentTransportController.deleteData
);

module.exports = router;
