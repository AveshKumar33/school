const mongoose = require("mongoose");

const marksSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
  },
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "standard",
    required: true,
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true,
  },
  examType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exam-type",
    required: true,
  },
  examName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "exam",
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  marks: [
    {
      maxMarks: {
        type: Number,
      },
      minMarks: {
        type: Number,
      },
      weightage: {
        type: Number,
      },
      obtainedMarks: {
        type: Number,
      },
      obtainedGrade: {
        type: String,
      },
      paperId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "paper",
      },
      remark: {
        type: String,
      },
    },
  ],
});

const stuMarksModel = mongoose.model("student-marks", marksSchema);

module.exports = marksSchema;
