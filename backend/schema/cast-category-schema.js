const mongoose = require("mongoose");

const castCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const castCategoryModel = mongoose.model("cast-category", castCategorySchema);

module.exports = castCategorySchema;
