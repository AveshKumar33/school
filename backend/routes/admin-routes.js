const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controller/admin-controller");

router.post("/", auth, checkUserRole(["admin"]), postAdmin);
router.get("/", auth, getAdmin);
router.put("/:id", auth, checkUserRole(["admin"]), updateAdmin);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteAdmin);

module.exports = router;
