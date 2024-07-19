const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  stateMaster,
  getStateMaster,
  getAllState,
  updateState,
  deleteState,
} = require("../controller/state-controller");

router.post("/", auth, checkUserRole(["admin"]), stateMaster);
router.get("/", auth, getStateMaster);
router.get("/all", auth, getAllState);
router.put("/:id", auth, checkUserRole(["admin"]), updateState);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteState);

module.exports = router;
