const mongoose = require("mongoose");

const accountSchema = mongoose.Schema({
  accountGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account-group",
    required: true,
  },

  accountName: {
    type: String,
    required: true,
    unique: true,
  },

  openingBalance: {
    type: Number,
    required: true,
  },
});

module.exports = accountSchema;
