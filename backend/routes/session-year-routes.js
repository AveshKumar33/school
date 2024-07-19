const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const sessionController = require("../controller/sessionController");

router.post("/", auth, checkUserRole(["admin"]), sessionController.AddSession);

router.get("/", auth, checkUserRole(["admin"]), sessionController.getSession);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  sessionController.getAllSession
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  sessionController.getSessionById
);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  sessionController.updateSession
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  sessionController.deleteById
);

module.exports = router;
