const mongoose = require("mongoose");

const accountGroupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  groupUnder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account-group",
    // required: true,
  },
});

// const accountGroupModel = mongoose.model(
//   "account-group",
//   accountGroupSchema
// );

module.exports = accountGroupSchema;
