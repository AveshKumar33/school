const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  startDate: {
    type: String,
    trim: true,
  },
  endDate: {
    type: String,
    trim: true,
  },
  connectionString: {
    type: String,
    trim: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const sessionModel = mongoose.model("session", sessionSchema);

module.exports = sessionSchema;
