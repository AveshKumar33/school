const mongoose = require("mongoose");

const feeRecordSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "standard",
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
  },
  month: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  feeHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fee-head",
    required: true,
  },
  isAllPaid: {
    type: Boolean,
    required: true,
  },
  isPreviousBalance: {
    type: Boolean,
    default: false,
  },
  feeDiscount: [
    {
      discountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fee-discount",
      },
      feeHead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fee-head",
      },
      discountMode: {
        type: String,
        trim: true,
      },
      discountValue: {
        type: Number,
        trim: true,
      },
    },
  ],
  discountReason: {
    type: String,
    default: "",
  },
  totalDiscount: {
    type: Number,
    default: 0,
  },
  remainingAmount: {
    type: Number,
    required: true,
  },
  incrementedAmount: {
    type: Number,
    default: 0,
  },
  log: [
    {
      receiptNo: {
        type: Number,
        required: true,
        trim: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true,
      },
      payableAmount: {
        type: Number,
        required: true,
        trim: true,
      },
      remainingAmount: {
        type: Number,
        required: true,
        trim: true,
      },
      discount: {
        type: Number,
        default: 0,
        trim: true,
      },
      date: {
        // payment date / bank paid date
        type: String,
        default: "",
      },
      voucherGeneratedDate: {
        type: String,
        default: null,
      },
      paymentMode: {
        type: String,
        trim: true,
      },
      remark: {
        type: String,
        default: "",
        trim: true,
      },
      chequeNumber: {
        type: String,
        default: "",
        trim: true,
      },
      transactionDate: {
        type: String,
        default: "",
        trim: true,
      },
      transactionNumber: {
        type: String,
        default: "",
        trim: true,
      },
      invoiceNumber: {
        type: String,
        default: "",
        trim: true,
      },
      batchNumber: {
        type: String,
        default: "",
        trim: true,
      },
      isCancel: {
        type: Boolean,
        default: false,
      },
      cancelDate: {
        type: String,
        default: "",
      },
      cancelReason: {
        type: String,
        default: "",
        trim: true,
      },
      cancelBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        default: null,
      },
      revokedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        default: null,
      },
      revokedDate: {
        type: String,
        default: "",
      },
      revokedReason: {
        type: String,
        default: "",
        trim: true,
      },
      isApproved: {
        type: Boolean,
        required: true,
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
      },
      approvedDate: {
        type: String,
        default: "",
      },
      isBankPaid: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

const feeRecordModel = mongoose.model("fee-records", feeRecordSchema);

module.exports = feeRecordSchema;
