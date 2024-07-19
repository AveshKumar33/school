const mongoose = require("mongoose");

const teachingTypeSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
});

const teachingTypeModel = mongoose.model("teaching-type", teachingTypeSchema);

module.exports = teachingTypeSchema;
