const mongoose = require("mongoose");

const driverSchema = mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "vehicle-details",
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
  },
  aadharNo: {
    type: Number,
    required: true,
  },
  licenceNo: {
    type: String,
    required: true,
  },
  validTill: {
    type: Date,
    required: true,
  },
  contactAddress: {
    type: String,
    required: true,
  },
  premanentAddress: {
    type: String,
    required: true,
  },
  referredBy: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  licence: {
    type: String,
    required: true,
  },
  aadharCard: {
    type: String,
    required: true,
  },
});

const driverModel = mongoose.model("vehicle-driver", driverSchema);

module.exports = driverSchema;
