const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const feeRecordController = require("../controller/feeRecordController");

router.post("/", auth, checkUserRole(["admin"]), feeRecordController.postData);

router.post(
  "/delete-and-create",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.deleteAndCreateData
);

router.post(
  "/fee-increment",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.studentFeeIncrement
);

router.post(
  "/transport",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.addTransportFeeRecord
);

router.get("/", auth, checkUserRole(["admin"]), feeRecordController.getData);

router.get(
  "/all",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getAllData
);

router.get(
  "/all/group/api",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getAllStudentFeeGroupedData
);

router.get(
  "/log",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getLogData
);

router.get(
  "/logs",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getLogsData
);

router.get(
  "/all/months",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getStudentsMonthPaid
);

// total class section wise
router.get(
  "/fee/total-fee",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getStandardTotalPaid
);

// total class section wise
router.get(
  "/fee/reamining-amount",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getTotalRemainingAmountHeadWise
);

// total class section wise
router.get(
  "/fee/fee-heads/api",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getAllFeeDataGroupedByFeeHEad
);

// total class section wise
router.get(
  "/fee/student-total-fee",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getStudentTotalPaidAndRemaining
);

router.get(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.getDataById
);

router.put(
  "/fee-discount",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.addFeeDiscount
);

router.put(
  "/cancle",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.cancelLog
);

router.put(
  "/revoke",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.revokeLog
);

router.put(
  "/update",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.updateData
);

router.put(
  "/approve",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.approvedLog
);

router.put(
  "/configure-discount",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.discountConfiguration
);

router.put(
  "/import",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.feeRecordDataImport
);

router.put(
  "/panelty-import",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.feeRecordPaneltyDataImport
);

router.put(
  "/discount-import",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.feeRecordDiscountDataImport
);

router.put(
  "/tranport",
  auth,
  checkUserRole(["admin"]),
  feeRecordController.transportFeeRecordUpdate
);

// router.put(
//   "/:id",
//   auth,
//   checkUserRole(["admin"]),
//   feeRecordController.updateData
// );

// router.delete(
//   "/:id",
//   auth,
//   checkUserRole(["admin"]),
//   feeRecordController.deleteData
// );

module.exports = router;
