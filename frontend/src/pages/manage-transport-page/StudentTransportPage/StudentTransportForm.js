import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import ManageTransportForm from "../../../components/Manage-Transport/Student-Transport/ManageTransportForm";

const StudentTransportFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Manage Transport Form"));
  }, [dispatch]);

  return (
    <>
      <ManageTransportForm />;
    </>
  );
};

export default StudentTransportFormPage;
