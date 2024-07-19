const mongoose = require("mongoose");

const postEnquirySchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    required: true,
  },
  enquiryPurpose: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "enquiry-purpose",
    required: true,
  },
  salutation: {
    type: String,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  stuMobileNo: {
    type: Number,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
    default: "",
  },
  castCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cast-category",
    trim: true,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  fatherOccupation: {
    type: String,
  },
  parentMobileNo: {
    type: Number,
  },
  whatsappMobileNo: {
    type: Number,
  },
  relation: {
    type: String,
  },
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "standard",
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "section",
  },
  courseType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course-type",
  },
  permanentAdd: {
    type: String,
  },
  correspondenceAdd: {
    type: String,
  },
  postOffice: {
    type: String,
  },
  pinCode: {
    type: Number,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city-master",
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "locality",
  },
  district: {
    type: String,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
  },
  nationality: {
    type: String,
  },
  schoolName: {
    type: String,
  },
  board: {
    type: String,
  },
  previousStandard: {
    type: String,
  },
  passingYear: {
    type: Date,
  },
  totalMarks: {
    type: Number,
  },
  obtainedMarks: {
    type: Number,
  },
  percentageCGPA: {
    type: Number,
  },
});

const postEnquiryModal = mongoose.model("post-enquiry", postEnquirySchema);

module.exports = postEnquirySchema;
