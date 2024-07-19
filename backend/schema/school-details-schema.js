const mongoose = require("mongoose");

const schoolSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: "",
  },
  UDISECode: {
    type: String,
    trim: true,
    default: "",
  },
  email: {
    type: String,
    trim: true,
    default: "",
  },
  mobileNo: {
    type: Number,
    trim: true,
  },
  otherMobileNo: {
    type: Number,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
    default: "",
  },
  logo: {
    type: String,
    required: true,
  },
});

const schoolDetailsModel = mongoose.model("school-details", schoolSchema);

module.exports = schoolSchema;
