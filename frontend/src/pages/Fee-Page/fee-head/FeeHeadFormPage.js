import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import FeeHeadForm from "../../../components/Fee/Fee-Head/FeeHeadFrom";

const FeeHeadFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Fee Head Form"));
  }, [dispatch]);

  return <FeeHeadForm />;
};

export default FeeHeadFormPage;
