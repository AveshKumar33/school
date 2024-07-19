import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import FeeStructureList from "../../../components/Fee/Fee-Structure/FeeStructureList";

const FeeStructureListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Fee Structure"));
  }, [dispatch]);

  return (
    <>
      <FeeStructureList />
    </>
  );
};

export default FeeStructureListPage;
