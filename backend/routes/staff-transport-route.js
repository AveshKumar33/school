const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const staffTranspportController = require("../controller/staffTranspportController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  staffTranspportController.postData
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  staffTranspportController.getData
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  staffTranspportController.getAlldata
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  staffTranspportController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  staffTranspportController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  staffTranspportController.deleteData
);

module.exports = router;
