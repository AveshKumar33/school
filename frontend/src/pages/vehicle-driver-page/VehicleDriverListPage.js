import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import VehicleDriverList from "../../components/Vehicle-Driver/VehicleDriverList";

const VehicleDriverListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Driver"));
  }, [dispatch]);

  return <VehicleDriverList />;
};

export default VehicleDriverListPage;
