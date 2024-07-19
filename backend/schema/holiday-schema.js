const mongoose = require("mongoose");

const holidaySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  userType: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "designation",
    required: true,
  },
  standard: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "standard",
  },
  section: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "section",
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const holidayModel = mongoose.model("holiday", holidaySchema);

module.exports = holidaySchema;
