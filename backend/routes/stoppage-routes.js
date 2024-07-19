const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const StoppageController = require("../controller/StoppageController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  StoppageController.postStoppage
);

router.get("/", auth, checkUserRole(["admin"]), StoppageController.getStoppage);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  StoppageController.getAllStoppage
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  StoppageController.updateStoppage
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  StoppageController.deleteStoppage
);

module.exports = router;
