import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import VehicleDriverForm from "../../components/Vehicle-Driver/VehicleDriverForm";

const VehicleDriverFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Driver Form"));
  }, [dispatch]);

  return <VehicleDriverForm />;
};

export default VehicleDriverFormPage;
