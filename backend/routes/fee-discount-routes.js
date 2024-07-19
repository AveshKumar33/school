const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const feeDiscountController = require("../controller/feeDiscountController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  feeDiscountController.postData
);

router.get("/", auth, checkUserRole(["admin"]), feeDiscountController.getData);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  feeDiscountController.getAllData
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  feeDiscountController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  feeDiscountController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  feeDiscountController.deleteData
);

module.exports = router;
