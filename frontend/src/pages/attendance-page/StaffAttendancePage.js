import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import Attendance from "../../components/Staff-Attendance/StaffAttendance";

const StaffAttendancePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Attendance"));
  }, [dispatch]);

  return <Attendance />;
};

export default StaffAttendancePage;
