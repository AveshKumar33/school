const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postStandard,
  getStandard,
  getStandardById,
  getAllStandard,
  getAllStandardSessionWise,
  updateStandard,
  deleteStandard,
} = require("../controller/standard-controller");

router.post("/", auth, checkUserRole(["admin"]), postStandard);
router.get("/", auth, getStandard);
router.get("/all", auth, getAllStandardSessionWise);
router.get("/all/api", auth, getAllStandard);
router.get("/:id", auth, checkUserRole(["admin"]), getStandardById);
router.put("/:id", auth, checkUserRole(["admin"]), updateStandard);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteStandard);

module.exports = router;
