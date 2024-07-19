const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { generatePdf } = require("../controller/student-pdf-controller");
const {
  feeStructurePdf,
} = require("../controller/feeStructure-pdf-controller");

const { holidayPdf } = require("../documentController/holidayPdf");
const { feeSlipPdf } = require("../documentController/feeSlipPdf");
const { feeVoucherPdf } = require("../documentController/feeVoucherPdf");

const { generatePDF } = require("../controller/pdf-controller");

router.get("/student/:id", auth, generatePdf);
router.get("/fee-structure/:id", auth, feeStructurePdf);
router.get("/holidayPdf", auth, holidayPdf);
router.get("/fee-slip-pdf", auth, feeSlipPdf);
router.get("/fee-voucher", auth, feeVoucherPdf);
router.get("/working", generatePDF);

module.exports = router;
