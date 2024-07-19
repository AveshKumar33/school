const mongoose = require("mongoose");

const feeHeadSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  paidMonth: {
    type: Array,
    required: true,
  },

  accountNameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
    required: true,
  },

  newStudentOnly: {
    type: Boolean,
    default: false,
  },
});

const fee_model = mongoose.model("fee-head", feeHeadSchema);

module.exports = feeHeadSchema;
