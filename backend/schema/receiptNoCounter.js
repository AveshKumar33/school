const mongoose = require("mongoose");

const receiptCounterSchema = mongoose.Schema({
  id: {
    type: String,
  },
  receiptNo: {
    type: Number,
  },
});

const receiptCounterModel = mongoose.model(
  "receipt-counter",
  receiptCounterSchema
);

module.exports = receiptCounterSchema;
