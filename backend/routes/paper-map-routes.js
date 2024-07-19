const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const paperMapController = require("../controller/paperMapController");

router.post("/", auth, checkUserRole(["admin"]), paperMapController.postData);

router.get("/", auth, checkUserRole(["admin"]), paperMapController.getData);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  paperMapController.getAlldata
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  paperMapController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  paperMapController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  paperMapController.deleteData
);

module.exports = router;
