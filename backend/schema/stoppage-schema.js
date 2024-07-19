const mongoose = require("mongoose");

const stoppageSchema = mongoose.Schema({
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle-route",
    required: true,
  },
  stoppageName: {
    type: String,
    required: true,
  },
  stoppageAddress: {
    type: String,
    required: true,
  },
  designationDistance: {
    type: Number,
    required: true,
  },
  transportFee: {
    type: Number,
    required: true,
  },
});

const stoppageModel = mongoose.model("stoppage", stoppageSchema);

module.exports = stoppageSchema;
