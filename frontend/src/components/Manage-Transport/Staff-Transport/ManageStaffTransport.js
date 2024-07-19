import React, { useState } from "react";
import ManageStaffTransportForm from "./ManageStaffTransportForm";
import ManageSaffTransportList from "./ManageStaffTransportList";

const ManageStaffTransport = () => {
  const [editedData, setEditedData] = useState();
  return (
    <>
      <ManageStaffTransportForm
        editedData={editedData}
        setEditedData={setEditedData}
      />
      <ManageSaffTransportList setEditedData={setEditedData} />
    </>
  );
};

export default ManageStaffTransport;
