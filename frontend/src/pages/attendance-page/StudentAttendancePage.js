import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import StudentAttendance from "../../components/Student-Attendance/StudentAttendance";

const StudentAttendancePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Attendance"));
  }, [dispatch]);

  return <StudentAttendance />;
};

export default StudentAttendancePage;
