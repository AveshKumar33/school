const mongoose = require("mongoose");

const enquiryPurposeSchema = mongoose.Schema({
  purpose: {
    type: String,
    required: true,
  },
});

const enquiryPurposeModel = mongoose.model(
  "enquiry-purpose",
  enquiryPurposeSchema
);

module.exports = enquiryPurposeSchema;
