const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const EnquiryPurposeController = require("../controller/EnquiryPurposeController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  EnquiryPurposeController.postData
);

router.get(
  "/",
  auth,
  checkUserRole(["admin"]),
  EnquiryPurposeController.getData
);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  EnquiryPurposeController.getAllData
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  EnquiryPurposeController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  EnquiryPurposeController.deleteData
);

module.exports = router;
