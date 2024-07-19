import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import AttendanceHistoryList from "../../components/Attendance-History/AttendanceHistoryList";

const AttendanceHistoryPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Attendance History"));
  }, [dispatch]);

  return <AttendanceHistoryList />;
};

export default AttendanceHistoryPage;
