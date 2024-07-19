import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import CityForm from "../../../components/Master/City/CityForm";

const CityFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("City Form"));
  }, [dispatch]);
  return <CityForm />;
};

export default CityFormPage;
