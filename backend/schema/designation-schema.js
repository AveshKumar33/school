const mongoose = require("mongoose");

const designationSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const designation_model = mongoose.model("designation", designationSchema);

module.exports = designationSchema;
