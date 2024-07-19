const mongoose = require("mongoose");

// const studentTranspSchema = mongoose.Schema({
//   session: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "session",
//     required: true,
//   },
//   standard: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "standard",
//     required: true,
//   },
//   section: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "section",
//     required: true,
//   },
//   transportData: [
//     {
//       student: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "student",
//         required: true,
//       },
//       route: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "vehicle-route",
//         required: true,
//       },
//       stoppage: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "stoppage",
//         required: true,
//       },
//       transportFee: {
//         type: Number,
//         required: true,
//       },
//       startDate: {
//         type: String,
//         required: true,
//       },
//       endDate: {
//         type: String,
//         required: true,
//       },
//       description: {
//         type: String,
//         trim: true,
//       },
//     },
//   ],
// });

const studentTranspSchema = mongoose.Schema({
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
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
    required: true,
  },

  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle-route",
    required: true,
  },
  stoppage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "stoppage",
    required: true,
  },
  transportFee: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const stuTransportModel = mongoose.model(
  "student-transport",
  studentTranspSchema
);

module.exports = studentTranspSchema;
