const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postSection,
  getSection,
  getAllSection,
  updateSection,
  deleteSection,
} = require("../controller/section-controller");

router.post("/", auth, checkUserRole(["admin"]), postSection);
router.get("/", auth, getSection);
router.get("/all", auth, getAllSection);
router.put("/:id", auth, checkUserRole(["admin"]), updateSection);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteSection);

module.exports = router;
