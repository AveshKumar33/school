import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import StudentForm from "../../components/Student/StudentForm";

const StudentFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Admission Form"));
  }, [dispatch]);

  return <StudentForm />;
};

export default StudentFormPage;
