import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProtectedRoute from "./pages/landing-page/ProtectedRoute";
import Home from "./pages/landing-page/Home";
import NotFoundPage from "./pages/404-page/NotFoundPage";
import StandardFormPage from "./pages/Master/standard-page/StandardFormPage";
import StandardListPage from "./pages/Master/standard-page/StandardListPage";
import EditStandardFormPage, {
  loader as standardDataLoader,
} from "./pages/Master/standard-page/EditStandardFormPage";
import SectionListPage from "./pages/Master/section-page/SectionListPage";
import CityFormPage from "./pages/Master/city-page/CityFormPage";
import CityListPage from "./pages/Master/city-page/CityList.Page";
import LocalityFormPage from "./pages/Master/locality-page/LocalityFormPage";
import LocalityListPage from "./pages/Master/locality-page/LocalityListPage";
import StudentFormPage from "./pages/student-page/StudentFormPage";
import StudetListPage from "./pages/student-page/StudentListPge";
import EditStudentForm, {
  loader as studentDetailsLoader,
} from "./pages/student-page/EditStudentPage";
import EnquiryStudentFormPage, {
  loader as enquiryStudentDetailsLoader,
} from "./pages/student-page/EnquiryStudentFormPage";
import StateFormPage from "./pages/state-page/StateFormPage";
import StateListPage from "./pages/state-page/StateListPage";
import FeeHeadFormPage from "./pages/Fee-Page/fee-head/FeeHeadFormPage";
import EditFeeHeadFormPage, {
  loader as feeHeadLoader,
} from "./pages/Fee-Page/fee-head/EditFeeHead";
import FeeDiscountPage from "./pages/Fee-Page/fee-discount/FeeDiscountPage";
import FeeDiscountFormPage from "./pages/Fee-Page/fee-discount/FeeDiscountFormPage";
import FeeDiscountEditFormPage, {
  loader as feeDiscountLoader,
} from "./pages/Fee-Page/fee-discount/FeeDiscountEditFormPage";
import FeeStructureFormPage from "./pages/Fee-Page/fee-structure/FeeStructureFormPage";
import FeeStructureListPage from "./pages/Fee-Page/fee-structure/FeeStructureListPage";
import FeeHeadListPage from "./pages/Fee-Page/fee-head/FeeHeadListPage";
import FeeOutstndingPage from "./pages/Fee-Page/fee-outstanding/FeeOutstndingPage";
import FeeIncrementPage from "./pages/Fee-Page/fee-increment/FeeIncrementPage";
import EditFeeStructurePage, {
  loader as feeStructureLoader,
} from "./pages/Fee-Page/fee-structure/EditFeeStructurePage";
import StudentsFeeOutstandingPage from "./pages/Fee-Page/fee-outstanding/StudentsFeeOutstandingPage";
import GenerateVoucherPage from "./pages/generate-voucher/GenerateVoucherPage";
import EmployeeFormPage from "./pages/Employee-page/EmployeeFormPage";
import EmployeeListPage from "./pages/Employee-page/EmployeeListPage";
import EditEmployeeFormPage, {
  loader as employeeDetailsLoader,
} from "./pages/Employee-page/EditEmployeePage";
import DesignationListPage from "./pages/designation-page/DesigListPage";
import SettingPage from "./pages/setting-page/SettingPage";
import Dashboard from "./pages/DashbordPage/Dasboard";
import RootLayout from "./pages/landing-page/root";
import AssignmentFormPage from "./pages/assignment/AssignmentFormPage";
import AccountPage from "./pages/account/AccountPage";
import AccountGroupPage from "./pages/account/AcountGroupPage";
import AccountFormPage from "./pages/account/AccountFormPage";
import EditAccountFormPage, {
  loader as accountDetails,
} from "./pages/account/EditAccountFormPage";
import VehicleRoutePage from "./pages/vehicle-route-page/VehicleRoutePage";
import StoppagePage from "./pages/Master/stoppage-page/StoppagePage";
import VehicleDriverFormPage from "./pages/vehicle-driver-page/VehicleDriverFormPage";
import VehicleDriverListPage from "./pages/vehicle-driver-page/VehicleDriverListPage";
import EditVehicleDriverFormPage, {
  loader as driverDetails,
} from "./pages/vehicle-driver-page/EditVehicleDriverPage";
import VehiclePage from "./pages/vehicle-page/VehiclePage";
import HolidayPage from "./pages/Master/holiday-page/HolidayPage";
import SessionFormPage from "./pages/session-page/SessionFormPage";
import SessionListPage from "./pages/session-page/SessionListPage";
import EditSessionFormPage, {
  loader as sessionDataLoader,
} from "./pages/session-page/EditSessionPage";
import StaffAttendancePage from "./pages/attendance-page/StaffAttendancePage";
import StudentAttendancePage from "./pages/attendance-page/StudentAttendancePage";
import ManageStudentTransportPage from "./pages/manage-transport-page/StudentTransportPage/ManageTransportPage";
import AttendanceHistoryPage from "./pages/attendance-history-page/AttendanceHistoryPage";
import StudentTransportFormPage from "./pages/manage-transport-page/StudentTransportPage/StudentTransportForm";
import EditStudentTransportFormPage, {
  loader as studentTransportDataLoader,
} from "./pages/manage-transport-page/StudentTransportPage/EditStudentTransportFormPage";
import ManageStaffTransportPage from "./pages/manage-transport-page/StaffTransportPage/ManageStaffTransportPage";
import CourseTypePage from "./pages/course-type-page/CourseTypePage";
import AddExamPage from "./pages/ExamPage/AddExamPage/AddExamPage";
import ExamTypePage from "./pages/ExamPage/ExamTypePage/ExamTypePage";
import ExamSchedulePage from "./pages/ExamPage/ExamSchedulePage/ExamSchedulePage";
import ExamScheduleFormPage from "./pages/ExamPage/ExamSchedulePage/ExamScheduleFormPage";
import ExamScheduleEditFormPage, {
  loader as examScheduleData,
} from "./pages/ExamPage/ExamSchedulePage/ExamScheduleEditFormPage";
import ExamMarksPage from "./pages/ExamPage/ExamMarksPage/ExamMarksPage";
import PaperPage from "./pages/paper-page/PaperPage";
import PaperMapPage from "./pages/ExamPage/PaperMapPage/PaperMapPage";
import PaperMapFormPage from "./pages/ExamPage/PaperMapPage/PaperMapFormPage";
import PaperMapEditFormPage, {
  loader as paperMapdata,
} from "./pages/ExamPage/PaperMapPage/PaperMapEditFormPage";
import EnquiryPurposePage from "./pages/Master/EnquiryPurpose/EnquiryPurposePage";
import PostEnquiryPage from "./pages/Post-Enquiry-Page/PostEnquiryPage";
import PostEnquiryFormPage from "./pages/Post-Enquiry-Page/PostEnquiryFormPage";
import PostEnquiryEditPage, {
  loader as postEnquiryLoader,
} from "./pages/Post-Enquiry-Page/PostEnquiryEditPage";
import CastCategoryPage from "./pages/Master/CastCategoryPage/CastCategoryPage";
import StudentCategoryPage from "./pages/Master/StudentCategoryPage/StudentCategoryPage";
import TeachingTypePage from "./pages/Master/TeacinhTypePage/TeachingTypePage";
import TeacherSpecializationPage from "./pages/teacher-specialization-page/TeacherSpecializationPage";
import TeacherSpecializationFormPage from "./pages/teacher-specialization-page/TeacherSpecializationFormPage";
import EditTeacherSpecializationFormPage, {
  loader as loadTeacherData,
} from "./pages/teacher-specialization-page/EditTeacherSpecializationFormPage";
import FeeCollectionPage from "./pages/Fee-Page/fee-collection/FeeCollectionPage";
import SchoolDetailsPage, {
  loader as schoolDetailsLoader,
} from "./pages/Master/school-details-page/SchoolDetailsPage";
import StudentMigrationPage from "./pages/student-migration/StudentMigrationPage";
import StudentImportPage from "./pages/student-import/StudentImportPage";
import FeeRecordImportPage from "./pages/feeRecord-import/FeeRecordImportPage";
import PaneltyImportPage from "./pages/feeRecord-import/PaneltyImportPage";
import FeeDiscountImportPage from "./pages/feeRecord-import/FeeDiscountImportPage";

// import "./App.css";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayout />,
    id: "root",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/dashborad",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "student", "teacher"]} />
        ),
        children: [{ index: true, element: <Dashboard /> }],
      },
      {
        path: "standard-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StandardFormPage /> }],
      },
      {
        path: "standard-list",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <StandardListPage /> }],
      },
      {
        path: "edit/standard-data/:id",
        id: "standard-data",
        loader: standardDataLoader,
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <EditStandardFormPage /> }],
      },
      {
        path: "section-list",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <SectionListPage /> }],
      },
      {
        path: "city-form",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <CityFormPage /> }],
      },
      {
        path: "city-list",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <CityListPage /> }],
      },
      {
        path: "/locality-form",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <LocalityFormPage /> }],
      },
      {
        path: "/locality-list",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <LocalityListPage /> }],
      },
      {
        path: "/student-form",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <StudentFormPage /> }],
      },
      {
        path: "/student-list",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <StudetListPage /> }],
      },
      {
        path: "/edit-student/:id",
        loader: studentDetailsLoader,
        id: "student-details",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditStudentForm /> }],
      },
      {
        path: "/add-student/:id",
        id: "enquiary-student-details",
        loader: enquiryStudentDetailsLoader,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EnquiryStudentFormPage /> }],
      },
      {
        path: "/state-form",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <StateFormPage /> }],
      },
      {
        path: "/state-list",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <StateListPage /> }],
      },
      {
        path: "fee/fee-collection",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeCollectionPage /> }],
      },
      {
        path: "fee/fee-head-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeHeadFormPage /> }],
      },
      {
        path: "fee/edit-fee-head-form/:id",
        id: "fee-head-details",
        loader: feeHeadLoader,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditFeeHeadFormPage /> }],
      },
      {
        path: "/fee/fee-head-list",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <FeeHeadListPage /> }],
      },
      {
        path: "/fee/fee-structure",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <FeeStructureFormPage /> }],
      },
      {
        path: "/fee/fee-structure-list",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <FeeStructureListPage /> }],
      },
      {
        path: "/fee/fee-discount",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeDiscountPage /> }],
      },
      {
        path: "/fee/generate-voucher",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <GenerateVoucherPage /> }],
      },
      {
        path: "/fee/fee-outstanding",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeOutstndingPage /> }],
      },
      {
        path: "/fee/fee-increment",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeIncrementPage /> }],
      },
      {
        path: "/fee/student-fee-outstanding",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StudentsFeeOutstandingPage /> }],
      },
      {
        path: "/fee/fee-discount-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeDiscountFormPage /> }],
      },
      {
        path: "/fee/edit-fee-discount-form/:id",
        id: "fee-discount-details",
        loader: feeDiscountLoader,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeDiscountEditFormPage /> }],
      },
      {
        path: "/fee/edit-fee-structure/:id",
        id: "fee-structure-details",
        loader: feeStructureLoader,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditFeeStructurePage /> }],
      },
      {
        path: "/designation-list",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <DesignationListPage /> }],
      },
      {
        path: "/employee-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EmployeeFormPage /> }],
      },
      {
        path: "/employee-list",
        element: <ProtectedRoute allowedUserTypes={["admin", "teacher"]} />,
        children: [{ index: true, element: <EmployeeListPage /> }],
      },
      {
        path: "edit-employee/:id",
        loader: employeeDetailsLoader,
        id: "employee-details",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditEmployeeFormPage /> }],
      },
      {
        path: "setting",
        element: (
          <ProtectedRoute allowedUserTypes={["admin", "teacher", "student"]} />
        ),
        children: [{ index: true, element: <SettingPage /> }],
      },
      {
        path: "assignment",
        element: <ProtectedRoute allowedUserTypes={["teacher"]} />,
        children: [{ index: true, element: <AssignmentFormPage /> }],
      },
      {
        path: "account",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <AccountPage /> }],
      },
      {
        path: "create-account",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <AccountFormPage /> }],
      },
      {
        path: "edit-account/:id",
        loader: accountDetails,
        id: "account-data",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditAccountFormPage /> }],
      },
      {
        path: "account-group",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <AccountGroupPage /> }],
      },
      {
        path: "route",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <VehicleRoutePage /> }],
      },
      {
        path: "stoppage",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StoppagePage /> }],
      },
      {
        path: "vehicle-driver",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <VehicleDriverListPage /> }],
      },
      {
        path: "add-driver",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <VehicleDriverFormPage /> }],
      },
      {
        path: "edit-driver/:id",
        loader: driverDetails,
        id: "driver-data",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditVehicleDriverFormPage /> }],
      },
      {
        path: "vehicle",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <VehiclePage /> }],
      },
      {
        path: "holiday",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <HolidayPage /> }],
      },
      {
        path: "session-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <SessionFormPage /> }],
      },
      {
        id: "session-data",
        loader: sessionDataLoader,
        path: "edit-session/:id",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditSessionFormPage /> }],
      },
      {
        path: "session",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <SessionListPage /> }],
      },
      {
        path: "staff-attendance",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StaffAttendancePage /> }],
      },
      {
        path: "student-attendance",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StudentAttendancePage /> }],
      },
      {
        path: "attendance-history",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <AttendanceHistoryPage /> }],
      },
      {
        path: "student/transport",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ManageStudentTransportPage /> }],
      },
      {
        path: "student/transport-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StudentTransportFormPage /> }],
      },
      {
        id: "student-transport-data",
        loader: studentTransportDataLoader,
        path: "student/edit-transport-form/:id",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EditStudentTransportFormPage /> }],
      },
      {
        path: "staff/transport",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ManageStaffTransportPage /> }],
      },
      {
        path: "course-type",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <CourseTypePage /> }],
      },
      {
        path: "exam/add",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <AddExamPage /> }],
      },
      {
        path: "exam/type",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ExamTypePage /> }],
      },
      {
        path: "exam/exam-schedule",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ExamSchedulePage /> }],
      },
      {
        path: "exam/exam-schedule-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ExamScheduleFormPage /> }],
      },
      {
        path: "exam/exam-marks",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ExamMarksPage /> }],
      },
      {
        id: "exam-schedule-data",
        loader: examScheduleData,
        path: "exam/exam-schedule-edit-form/:id",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <ExamScheduleEditFormPage /> }],
      },
      {
        path: "paper",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <PaperPage /> }],
      },
      {
        path: "exam/paper-map",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <PaperMapPage /> }],
      },
      {
        path: "exam/paper-map-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <PaperMapFormPage /> }],
      },
      {
        path: "exam/edit-paper-map-form/:id",
        id: "paper-map-data",
        loader: paperMapdata,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [
          {
            index: true,
            element: <PaperMapEditFormPage />,
          },
        ],
      },
      {
        path: "enquiry/enquiry-purpose",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <EnquiryPurposePage /> }],
      },
      {
        path: "enquiry/post-enquiry",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <PostEnquiryPage /> }],
      },
      {
        path: "cast-category",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <CastCategoryPage /> }],
      },
      {
        path: "student-category",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StudentCategoryPage /> }],
      },
      {
        path: "enquiry/post-enquiry-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <PostEnquiryFormPage /> }],
      },
      {
        path: "enquiry/edit-post-enquiry/:id",
        id: "post-enquiry-data",
        loader: postEnquiryLoader,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [
          {
            index: true,
            element: <PostEnquiryEditPage />,
          },
        ],
      },
      {
        path: "teaching-type",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <TeachingTypePage /> }],
      },
      {
        path: "teacher-specialization",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <TeacherSpecializationPage /> }],
      },
      {
        path: "teacher-specialization-form",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <TeacherSpecializationFormPage /> }],
      },
      {
        path: "teacher-specialization-edit-form/:id",
        id: "teacher-specialization-details",
        loader: loadTeacherData,
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [
          { index: true, element: <EditTeacherSpecializationFormPage /> },
        ],
      },
      {
        id: "school-data",
        loader: schoolDetailsLoader,
        path: "school-details",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <SchoolDetailsPage /> }],
      },
      {
        path: "student-migration",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StudentMigrationPage /> }],
      },
      {
        path: "student-import",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <StudentImportPage /> }],
      },
      {
        path: "student/fee/fee-import",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeRecordImportPage /> }],
      },
      {
        path: "student/fee/fee-import/panelty",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <PaneltyImportPage /> }],
      },
      {
        path: "student/fee/fee-import/discount",
        element: <ProtectedRoute allowedUserTypes={["admin"]} />,
        children: [{ index: true, element: <FeeDiscountImportPage /> }],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
