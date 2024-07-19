const mongoose = require("mongoose");

const examScheduleSchema = mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paper-map",
    required: true,
  },
  scheduleDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const examScheduleModel = mongoose.model("exam-schedule", examScheduleSchema);

module.exports = examScheduleSchema;
