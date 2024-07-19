import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import AssignmentForm from "../../components/Assignment/AssignmentForm";

const AssignmentFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Assignment"));
  }, [dispatch]);
  return <AssignmentForm />;
};

export default AssignmentFormPage;
