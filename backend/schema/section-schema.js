const mongoose = require("mongoose");

const sectionSchema = mongoose.Schema({
  section: {
    type: String,
    required: true,
  },
});

const section_model = mongoose.model("section", sectionSchema);

module.exports = sectionSchema;
