const mongoose = require("mongoose");

const paperMapSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "standard",
    required: true,
  },
  sections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "section",
    required: true,
  },
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "paper",
    required: true,
  },
  examName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exam",
    required: true,
  },
  examType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exam-type",
    required: true,
  },
  maxMarks: {
    type: Number,
    required: true,
  },
  minMarks: {
    type: Number,
    required: true,
  },
  weightage: {
    type: Number,
  },
});

const paper_model = mongoose.model("paper-map", paperMapSchema);

module.exports = paperMapSchema;
