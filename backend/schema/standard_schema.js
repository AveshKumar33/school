const mongoose = require("mongoose");

const standardSchema = mongoose.Schema({
  standard: {
    type: String,
    required: true,
    unique: true,
  },
  sections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "section",
    required: true,
  },
});

const standard_model = mongoose.model("standard", standardSchema);

module.exports = standardSchema;
