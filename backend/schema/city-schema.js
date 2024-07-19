const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const city_model = mongoose.model("city-master", citySchema);

module.exports = citySchema;
