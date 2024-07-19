const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const postEnquiryController = require("../controller/postEnquiryController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  postEnquiryController.postData
);

router.get("/", auth, checkUserRole(["admin"]), postEnquiryController.getData);

// router.get("/all", auth, checkUserRole(["admin"]), postEnquiryController.getAllPaper);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  postEnquiryController.getDataById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  postEnquiryController.updateData
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  postEnquiryController.deleteData
);

module.exports = router;
