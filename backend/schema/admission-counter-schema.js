const mongoose = require("mongoose");

const admissionCounterSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  admissionNo: {
    type: Number,
  },
});

const admissionCounterModel = mongoose.model(
  "admission-counter",
  admissionCounterSchema
);

module.exports = admissionCounterModel;
