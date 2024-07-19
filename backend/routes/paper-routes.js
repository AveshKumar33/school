const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const paperController = require("../controller/paperController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  paperController.addOrUpdatePaper
);

router.get("/", auth, checkUserRole(["admin"]), paperController.getPaper);

router.get("/all", auth, checkUserRole(["admin"]), paperController.getAllPaper);

router.put("/:id", auth, checkUserRole(["admin"]), paperController.updatePaper);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  paperController.deletePaper
);

module.exports = router;
