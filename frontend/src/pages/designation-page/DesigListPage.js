import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import Designation from "../../components/Designation/Designation";

const DesignationListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Setting"));
  }, [dispatch]);

  return (
    <>
      <Designation />
    </>
  );
};

export default DesignationListPage;
