import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import ManageStaffTransport from "../../../components/Manage-Transport/Staff-Transport/ManageStaffTransport";

const ManageStaffTransportPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Manage Staff Transport"));
  }, [dispatch]);

  return (
    <>
      <ManageStaffTransport />;
    </>
  );
};

export default ManageStaffTransportPage;
