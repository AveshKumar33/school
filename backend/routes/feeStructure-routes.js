const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const {
  postFeeStructure,
  getFeeStructure,
  getAllFeeStructure,
  getFeeStructureAmountSumByMonth,
  getFeeStructureById,
  updateFeeStructure,
  deleteFee,
} = require("../controller/feeStructure-controller");

router.post("/", auth, checkUserRole(["admin"]), postFeeStructure);
router.get("/", auth, getFeeStructure);
router.get("/all", auth, getAllFeeStructure);
router.get("/all/months/amount", auth, getFeeStructureAmountSumByMonth);
router.get("/:id", auth, checkUserRole(["admin"]), getFeeStructureById);
router.put("/:id", auth, checkUserRole(["admin"]), updateFeeStructure);
router.delete("/:id", auth, checkUserRole(["admin"]), deleteFee);

module.exports = router;
