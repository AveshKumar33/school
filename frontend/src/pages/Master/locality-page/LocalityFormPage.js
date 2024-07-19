import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import LocalityForm from "../../../components/Master/Locality/LocalityForm";

const LocalityFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Locality Form"));
  }, [dispatch]);

  return <LocalityForm />;
};

export default LocalityFormPage;
