import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import VehicleRoute from "../../components/VehicleRoute/VehicleRoute";

const VehicleRoutePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Routes"));
  }, [dispatch]);

  return <VehicleRoute />;
};

export default VehicleRoutePage;
