const mongoose = require("mongoose");

const feeDiscontSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },

  discountName: {
    type: String,
    required: true,
  },

  feeHead: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "fee-head",
    required: true,
  },

  discountMode: {
    type: String,
    required: true,
  },

  discountValue: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },
});

const feeDiscountModel = mongoose.model("fee-discount", feeDiscontSchema);

module.exports = feeDiscontSchema;
