const mongoose = require("mongoose");

const teacherSpecializationSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
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
  paper: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "paper",
    required: true,
  },
});

const teacherSpecializationModel = mongoose.model(
  "teacher-specialization",
  teacherSpecializationSchema
);

module.exports = teacherSpecializationSchema;
