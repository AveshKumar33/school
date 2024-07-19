import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import ManageTransport from "../../../components/Manage-Transport/Student-Transport/ManageTransport";

const ManageStudentTransportPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Manage Transport"));
  }, [dispatch]);

  return (
    <>
      <ManageTransport />;
    </>
  );
};

export default ManageStudentTransportPage;
