const mongoose = require("mongoose");

const addExamSchema = mongoose.Schema({
  examName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = addExamSchema;
