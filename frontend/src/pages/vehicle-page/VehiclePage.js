import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import Vehicle from "../../components/Vehicle/Vehicle";

const VehiclePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Vehicle List"));
  }, [dispatch]);

  return (
    <>
      <Vehicle />;
    </>
  );
};

export default VehiclePage;
