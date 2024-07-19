const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postDesignation,
  getAllDesigntion,
  getDesignation,
  updateDesignation,
  deleteDesignation,
} = require("../controller/designation-controller");

router.post("/", auth, checkUserRole(["admin"]), postDesignation);
router.get("/", auth, getDesignation);
router.get("/all", auth, getAllDesigntion);
router.put("/:id", auth, checkUserRole(["admin"]), updateDesignation);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteDesignation);

module.exports = router;
