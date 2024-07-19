const mongoose = require("mongoose");

const vehicleDetailSchema = mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
  },
  IMEI_No: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  maximumAllowed: {
    type: Number,
    required: true,
  },
  insuranceDate: {
    type: Date,
    required: true,
  },
  insuranceCompany: {
    type: String,
    required: true,
  },
  pollutionCertficateDate: {
    type: Date,
    required: true,
  },
  fitnessCertficateDate: {
    type: Date,
    required: true,
  },
  serviceDueDate: {
    type: Date,
    required: true,
  },
  permitValidDate: {
    type: Date,
    required: true,
  },
});

const vehicleDetailsModel = mongoose.model(
  "vehicle-details",
  vehicleDetailSchema
);

module.exports = vehicleDetailSchema;
