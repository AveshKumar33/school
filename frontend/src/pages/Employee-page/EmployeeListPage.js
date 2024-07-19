import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import EmployeeList from "../../components/Employee/EmployeeList";

const EmployeeListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Employees"));
  }, [dispatch]);
  return <EmployeeList />;
};

export default EmployeeListPage;
