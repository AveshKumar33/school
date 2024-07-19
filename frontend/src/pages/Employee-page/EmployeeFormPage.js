import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import EmployeeForm from "../../components/Employee/EmployeeForm";

const EmployeeFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Employee Form"));
  }, [dispatch]);

  return <EmployeeForm />;
};

export default EmployeeFormPage;
