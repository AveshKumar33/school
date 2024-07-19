const mongoose = require("mongoose");

const feeStructureSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "standard",
    required: true,
  },
  section: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "section",
    required: true,
  },
  name: [
    {
      name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fee-head",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const feeStructureModel = mongoose.model("fee-structure", feeStructureSchema);

module.exports = feeStructureSchema;
