import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import Settings from "../../components/dashboard/components/Settings/Settings";

const SettingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Setting"));
  }, [dispatch]);
  return <Settings />;
};

export default SettingPage;
