const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const accountContriller = require("../controller/AccountController");
const accountGroupController = require("../controller/AccountGroupController");

// account routes

router.post("/", auth, checkUserRole(["admin"]), accountContriller.postAccount);

router.get("/", auth, checkUserRole(["admin"]), accountContriller.getAccount);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  accountContriller.getAllAccount
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  accountContriller.getAccountById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  accountContriller.updateAccount
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  accountContriller.deleteAccount
);

// account group routes
router.post(
  "/account-group",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.postAccountGroup
);

router.get(
  "/account-group",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.getAccountGroup
);

router.get(
  "/account-group/all",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.getAllAccountGroup
);

router.put(
  "/account-group/:id",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.updateAccountGroup
);

router.delete(
  "/account-group/:id",
  auth,
  checkUserRole(["admin"]),
  accountGroupController.deleteAccountGroup
);

module.exports = router;
