const mongoose = require("mongoose");

const transportIdSchema = mongoose.Schema({
  transportHeadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fee-head",
    required: true,
  },
});

const transportIdModel = mongoose.model("transportId", transportIdSchema);

module.exports = transportIdSchema;
