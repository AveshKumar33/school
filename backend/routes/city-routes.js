const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  cityMaster,
  getCityMaster,
  getAllCity,
  updateCity,
  deleteCity,
} = require("../controller/city-controller");

router.post("/", auth, checkUserRole(["admin"]), cityMaster);
router.get("/", auth, getCityMaster);
router.get("/all", auth, getAllCity);
router.put("/:id", auth, checkUserRole(["admin"]), updateCity);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteCity);

module.exports = router;
