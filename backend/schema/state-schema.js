const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const state_model = mongoose.model("state", stateSchema);

module.exports = stateSchema;
