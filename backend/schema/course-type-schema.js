const mongoose = require("mongoose");

const courseTypeSchema = mongoose.Schema({
  courseType: {
    type: String,
    required: true,
  },
});

const courseTypeModel = mongoose.model("course-type", courseTypeSchema);

module.exports = courseTypeSchema;
