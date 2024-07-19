const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  employeeNo: {
    type: String,
    // required: true,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "designation",
    // required: true,
  },
  salutation: {
    type: String,
    // required: true,
  },
  firstName: {
    type: String,
    // required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    // required: true,
  },
  gender: {
    type: String,
    // required: true,
  },
  castCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cast-category",
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  mobileNo: {
    type: Number,
    // required: true,
  },
  dateOfBirth: {
    type: String,
    // required: true,
  },
  aadharNo: {
    type: Number,
    // required: true,
  },
  qualification: {
    type: String,
    // required: true,
  },
  teachingType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teaching-type",
    // required: true,
  },
  maritalStatus: {
    type: String,
    // required: true,
  },
  religion: {
    type: String,
    // required: true,
  },
  bloodGroup: {
    type: String,
    // required: true,
  },
  fatherName: {
    type: String,
    // required: true,
  },
  motherName: {
    type: String,
    // required: true,
  },
  husband_wife_name: {
    type: String,
    // required: true,
  },
  bloodGroup: {
    type: String,
    // required: true,
  },
  permanentAdd: {
    type: String,
    // required: true,
  },
  correspondenceAdd: {
    type: String,
    // required: true,
  },
  postOffice: {
    type: String,
    // required: true,
  },
  district: {
    type: String,
    // required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city-master",
  },
  locality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "locality",
    // required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
    // required: true,
  },
  pinCode: {
    type: Number,
    // required: true,
  },
  nationality: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  joiningDate: {
    type: String,
    // required: true,
  },
  endOfProbation: {
    type: String,
    // required: true,
  },
  effectiveDate: {
    type: String,
    // required: true,
  },
  position: {
    type: String,
  },
  department: {
    type: String,
  },
  jobType: {
    type: String,
  },
  photo: {
    type: String,
    // required: true,
  },
  aadharCard: {
    type: String,
    // required: true,
  },
});

//const employee_model = mongoose.model("employee", employeeSchema);

module.exports = employeeSchema;
