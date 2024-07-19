import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import DashboardHome from "../../components/dashboard/components/Home/Home";
import { uiAction } from "../../redux/ui-slice";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Dashboard"));
  }, [dispatch]);
  return <DashboardHome />;
};

export default Dashboard;
