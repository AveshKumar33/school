const mongoose = require("mongoose");

const localitySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const locality_model = mongoose.model("locality", localitySchema);

module.exports = localitySchema;
