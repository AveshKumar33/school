const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session",
    // required: true,
  },
  admissionDate: {
    type: Date,
    // required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  joiningDate: {
    type: Date,
  },
  admissionNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  srnNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  registrationNo: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  CBSERegistrationNumber: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  annualIncome: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  bankAccountNumber: {
    type: Number,
    trim: true,
    // required: true,
  },
  enrollmentNo: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  transferCertificateNo: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  inActiveReason: {
    type: String,
    default: "",
  },
  salutation: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  firstName: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  middleName: {
    type: String,
    trim: true,
    default: "",
  },
  lastName: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  fatherName: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  fatherDateOfBirth: {
    type: Date,
  },
  fatherAadharNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  fatherOccupation: {
    type: String,
    trim: true,
    default: "",
  },
  motherName: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  fatherQualification: {
    type: String,
    trim: true,
    default: "",
  },
  motherAadharNo: {
    type: String,
    trim: true,
    // required: true,
  },
  parentMobileNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  whatsappMobileNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  relation: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  dateOfBirth: {
    type: Date,
    // required: true,
  },
  stuAadharNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  stuMobileNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  email: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  gender: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  castCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cast-category",
    trim: true,
    // required: true,
  },
  religion: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  bloodGroup: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  motherTongue: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  identificationMarks: {
    type: String,
    trim: true,
    default: "",
    // required: true,
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
  paper: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "paper",
    // required: true,
  },
  additionalPaper: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "paper",
  },
  courseType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course-type",
  },
  feeDiscount: [
    {
      feeDiscountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fee-discount",
      },
      feeHeadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fee-head",
      },
    },
  ],
  rollNo: {
    type: Number,
    trim: true,
    // required: true,
  },
  isHostelerStudent: {
    type: String,
    trim: true,
    default: "",
  },
  isStudent: {
    type: String,
    trim: true,
    default: "",
  },
  studentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student-category",
  },
  permanentAdd: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  correspondenceAdd: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  postOffice: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  pinCode: {
    type: Number,
    trim: true,
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
  district: {
    type: String,
    trim: true,
    // required: true,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "state",
    // required: true,
  },
  nationality: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  schoolName: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  board: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  previousStandard: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  passingYear: {
    type: Date,
    // required: true,
  },
  previousSchoolSub: {
    type: String,
    trim: true,
    default: "",
  },
  totalMarks: {
    type: Number,
    trim: true,
    // required: true,
  },
  obtainedMarks: {
    type: Number,
    trim: true,
    // required: true,
  },
  percentageCGPA: {
    type: Number,
    trim: true,
    // required: true,
  },
  photo: {
    type: String,
    default: "",
    // required: true,
  },
  marksheet: {
    type: String,
    default: "",
    // required: true,
  },
  aadharCard: {
    type: String,
    default: "",
    // required: true,
  },
  password: {
    type: String,
    trim: true,
    default: "",
    // required: true,
  },
  oldDbId: {
    type: Number,
  },
});

const student_model = mongoose.model("student", studentSchema);

module.exports = studentSchema;
