import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import StandardForm from "../../../components/Master/Standard/standardForm";

const StandardFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Standard Form"));
  }, [dispatch]);

  return (
    <>
      <StandardForm />
    </>
  );
};

export default StandardFormPage;
