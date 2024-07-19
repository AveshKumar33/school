const mongoose = require("mongoose");

const examTypeSchema = mongoose.Schema({
  examType: {
    type: String,
    required: true,
  },
});

const examTypeModel = mongoose.model("exam-type", examTypeSchema);

module.exports = examTypeSchema;
