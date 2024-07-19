import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import SessionYear from "../../../components/Master/sessionYear/Session";

const SessionYearPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Session"));
  }, [dispatch]);

  return (
    <>
      <SessionYear />;
    </>
  );
};

export default SessionYearPage;
