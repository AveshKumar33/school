import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import StudentList from "../../components/Student/StudentList";

const StudetListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Admission"));
  }, [dispatch]);

  return (
    <>
      <StudentList />
    </>
  );
};

export default StudetListPage;
