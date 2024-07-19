const mongoose = require("mongoose");

const paperSchema = mongoose.Schema({
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
    type: String,
    required: true,
  },
});

const paper_model = mongoose.model("paper", paperSchema);

module.exports = paperSchema;
