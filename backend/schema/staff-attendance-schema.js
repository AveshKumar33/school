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
  attendance: [
    {
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
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

const attendance_model = mongoose.model("staff-attendance", attendanceSchema);

module.exports = attendanceSchema;
