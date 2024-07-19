require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connections, connectDB } = require("./database/config");
const app = express();
const cors = require("cors");

const ErrorHandler = require("./middleware/errorHandler");
const UserTypeHandler = require("./middleware/userTypeHandler");

require("./cron/staff-attendance");
require("./cron/student-attendancs");
const standardRoutes = require("./routes/standard-routes");
const sectionRouter = require("./routes/section-routes");
const cityRoutes = require("./routes/city-routes");
const localityRoutes = require("./routes/locality-routes");
const stateRoutes = require("./routes/state-routes");
const studentRoutes = require("./routes/Student-routes");
const feeRoutes = require("./routes/fee-head-routes");
const feeStructureRoutes = require("./routes/feeStructure-routes");
const pdfRoutes = require("./routes/pdf-routes");
const designationRoutes = require("./routes/designation-routes");
const employeeRoutes = require("./routes/employee-routes");
const authRoutes = require("./routes/auth-routes");
const adminRutes = require("./routes/admin-routes");
const forgotPasswordRoutes = require("./routes/forgot-password-routes");
const assignmentRoutes = require("./routes/assignment-routes");
const accountRoutes = require("./routes/account-routes");
const accountGroupRoute = require("./routes/account-group-route");
const vehicleRouteRoutes = require("./routes/vehicle-route-routes");
const stoppageRoutes = require("./routes/stoppage-routes");
const vehicleDriverRoutes = require("./routes/vehicleDriver-routes");
const vehicleDetailsRoutes = require("./routes/vehicle-routes");
const holidayRoutes = require("./routes/holiday-routes");
const sessionRoutes = require("./routes/session-year-routes");
const staffAttend = require("./routes/staffAttendance-routes");
const studentAttend = require("./routes/studentAttendance-routes");
const sudentTransport = require("./routes/student-transport-routes");
const staffTransport = require("./routes/staff-transport-route");
const courseTypeRoute = require("./routes/course-type-route");
const addExamRoutes = require("./routes/add-exam-routes");
const examTypeRoutes = require("./routes/exam-type-routes");
const paperRoutes = require("./routes/paper-routes");
const paperMapRoutes = require("./routes/paper-map-routes");
const enquiryPurposeRoutes = require("./routes/enquiry-purpose-routes");
const postEnquiryRoutes = require("./routes/post-enquiry-routes");
const castCategoryRoutes = require("./routes/castCategory-routes");
const studentCategoryRoutes = require("./routes/studentCategory-routes");
const feeDiscontRoutes = require("./routes/fee-discount-routes");
const teachingTypeRoutes = require("./routes/teaching-type-routes");
const teacherSpecializationRoutes = require("./routes/teacher-specialization-routes");
const examScheduleRoutes = require("./routes/exam-schedule-routes");
const studentMarksRoutes = require("./routes/student-marks-routes");
const feeRecordRoutes = require("./routes/fee-record-routes");
const schoolDetailsRoutes = require("./routes/school-details-routes");
const transportIdRoutes = require("./routes/transportId-routes");

const PORT = process.env.PORT;

app.use("/ejs", express.static(path.join(__dirname, "./public/image")));
app.use("/style", express.static(path.join(__dirname, "./public/css")));
app.use("/file", express.static(path.join(__dirname, "./upload")));

app.use(
  cors({
    origin: true, // Allow requests from this origin
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.use("/", authRoutes);
app.use("/otp", forgotPasswordRoutes);

app.use(UserTypeHandler);
app.use("/admin", adminRutes);
app.use("/standard", standardRoutes);
app.use("/section", sectionRouter);
app.use("/city", cityRoutes);
app.use("/locality", localityRoutes);
app.use("/state", stateRoutes);
app.use("/student", studentRoutes);
app.use("/fee-head", feeRoutes);
app.use("/feestructure", feeStructureRoutes);
app.use("/pdf", pdfRoutes);
app.use("/designation", designationRoutes);
app.use("/employee", employeeRoutes);
app.use("/assignment", assignmentRoutes);
app.use("/account", accountRoutes);
app.use("/account-group", accountGroupRoute);
app.use("/routes", vehicleRouteRoutes);
app.use("/stoppage", stoppageRoutes);
app.use("/vehicle-driver", vehicleDriverRoutes);
app.use("/vehicle-details", vehicleDetailsRoutes);
app.use("/holiday", holidayRoutes);
app.use("/session", sessionRoutes);
app.use("/staff-attend", staffAttend);
app.use("/student-attend", studentAttend);
app.use("/student-transport", sudentTransport);
app.use("/staff-transport", staffTransport);
app.use("/course-type", courseTypeRoute);
app.use("/add-exam", addExamRoutes);
app.use("/exam-type", examTypeRoutes);
app.use("/paper", paperRoutes);
app.use("/paper-map", paperMapRoutes);
app.use("/exam-schedule", examScheduleRoutes);
app.use("/enquiry-purpose", enquiryPurposeRoutes);
app.use("/post-enquiry", postEnquiryRoutes);
app.use("/cast-category", castCategoryRoutes);
app.use("/student-category", studentCategoryRoutes);
app.use("/fee-discount", feeDiscontRoutes);
app.use("/teaching-type", teachingTypeRoutes);
app.use("/teacher-specialization", teacherSpecializationRoutes);
app.use("/marks", studentMarksRoutes);
app.use("/fee-record", feeRecordRoutes);
app.use("/school-details", schoolDetailsRoutes);
app.use("/transport-id", transportIdRoutes);

app.use(ErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`listening at port number ${PORT}`);
});

const io = require("socket.io")(server);

io.on("connection", (server) => {
  console.log("client connected");
});
