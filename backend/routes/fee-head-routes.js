const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postFeeHead,
  getFeeHead,
  getAllFeeHead,
  getAllFeeHeadOfSession,
  getFeeHeadById,
  updateFee,
  deleteFee,
} = require("../controller/fee-head-controllor");

router.post("/", auth, checkUserRole(["admin"]), postFeeHead);
router.get("/", auth, getFeeHead);
router.get("/all", auth, getAllFeeHead);
router.get("/all/session/api", auth, getAllFeeHeadOfSession);
router.get("/:id", auth, checkUserRole(["admin"]), getFeeHeadById);
router.put("/:id", auth, checkUserRole(["admin"]), updateFee);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteFee);

module.exports = router;
