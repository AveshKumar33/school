const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const transportIdController = require("../controller/transportIdController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  transportIdController.postData
);

router.get("/", auth, checkUserRole(["admin"]), transportIdController.getData);

module.exports = router;
