const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  date: {
    type: String,
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
  attendance: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
      status: {
        type: String,
      },
      leaveType: {
        type: String,
      },
      remark: {
        type: String,
      },
    },
  ],
});

const stuAttendance_model = mongoose.model(
  "student-attendance",
  attendanceSchema
);

module.exports = attendanceSchema;
