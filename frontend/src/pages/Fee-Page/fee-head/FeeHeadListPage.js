import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";

import FeeHeadList from "../../../components/Fee/Fee-Head/FeeHeadList";

const FeeHeadListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Fee Head"));
  }, [dispatch]);

  return (
    <>
      <FeeHeadList />
    </>
  );
};

export default FeeHeadListPage;
