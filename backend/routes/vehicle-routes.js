const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const vehicleDetailsController = require("../controller/vehicleDetailsController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  vehicleDetailsController.postVehicleDetails
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  vehicleDetailsController.getVehicle
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  vehicleDetailsController.getAllVehicle
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  vehicleDetailsController.updateVehicleData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  vehicleDetailsController.deleteVehicleDetails
);

module.exports = router;
