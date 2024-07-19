import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import Stoppage from "../../../components/Master/Stoppage/Stoppage";

const StoppagePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Stoppage"));
  }, [dispatch]);

  return <Stoppage />;
};

export default StoppagePage;
