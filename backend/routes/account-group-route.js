const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const accountGroupController = require("../controller/AccountGroupController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.postAccountGroup
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.getAccountGroup
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.getAllAccountGroup
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.updateAccountGroup
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.deleteAccountGroup
);

module.exports = router;
