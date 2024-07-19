import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import FeeStructureForm from "../../../components/Fee/Fee-Structure/FeeStructureForm";

const FeeStructureFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Fee Structure Form"));
  }, [dispatch]);
  return <FeeStructureForm />;
};

export default FeeStructureFormPage;
