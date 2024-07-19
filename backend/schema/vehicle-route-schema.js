const mongoose = require("mongoose");

const vehicleRouteSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  routeCode: {
    type: String,
    required: true,
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle-details",
    required: true,
  },
  endPlace: {
    type: String,
    required: true,
  },
  startPlace: {
    type: String,
    required: true,
  },
  routeDistance: {
    type: Number,
    required: true,
  },
  remark: {
    type: String,
    required: true,
  },
});

const vehicleRouteModel = mongoose.model("vehicle-route", vehicleRouteSchema);

module.exports = vehicleRouteSchema;
