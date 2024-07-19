const mongoose = require("mongoose");

const staffTranspSchema = mongoose.Schema({
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "designation",
    required: true,
  },
  transportData: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
        required: true,
      },
      route: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehicle-route",
        required: true,
      },
      stoppage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stoppage",
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
});

const staffTransportModel = mongoose.model(
  "staff-transport",
  staffTranspSchema
);

module.exports = staffTranspSchema;
