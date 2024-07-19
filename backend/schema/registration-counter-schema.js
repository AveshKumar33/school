const mongoose = require("mongoose");

const regCounterSchema = mongoose.Schema({
  id: {
    type: String,
  },
  registrationNo: {
    type: Number,
  },
});

const regCounterModel = mongoose.model(
  "registration-counter",
  regCounterSchema
);

module.exports = regCounterModel;
