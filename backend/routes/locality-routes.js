const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postLocality,
  getLocality,
  getAllLocality,
  updateLocality,
  deleteLocality,
} = require("../controller/Locality-controller");

router.post("/", auth, checkUserRole(["admin"]), postLocality);
router.get("/", auth, getLocality);
router.get("/all", auth, getAllLocality);
router.put("/:id", auth, checkUserRole(["admin"]), updateLocality);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteLocality);

module.exports = router;
