const express = require("express");
const router = express.Router();

const uploadMany = require("../middleware/driver-file-upload");
const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const BusDriverController = require("../controller/VehicleDriverController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  uploadMany,
  BusDriverController.postData
);

router.get("/", auth, checkUserRole(["admin"]), BusDriverController.getData);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  BusDriverController.getAllData
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  BusDriverController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  uploadMany,
  BusDriverController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  BusDriverController.deleteData
);

router.get("/file/:filename", BusDriverController.viewsFile);

module.exports = router;
