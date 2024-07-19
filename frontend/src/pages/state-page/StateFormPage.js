import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import StateForm from "../../components/State/StateForm";

const StateFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("State Form"));
  }, [dispatch]);
  return <StateForm />;
};

export default StateFormPage;
