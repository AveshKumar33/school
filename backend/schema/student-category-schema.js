const mongoose = require("mongoose");

const studentCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const studentCategoryModel = mongoose.model(
  "student-category",
  studentCategorySchema
);

module.exports = studentCategorySchema;
