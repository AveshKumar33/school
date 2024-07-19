const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const TransportRoutesControllor = require("../controller/VehicleRoutesControllor");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  TransportRoutesControllor.postTransportRoute
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  TransportRoutesControllor.getTransportRoute
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  TransportRoutesControllor.getAllTransportRoute
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  TransportRoutesControllor.updateTransportRoute
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  TransportRoutesControllor.deleteTransportRoute
);

module.exports = router;
