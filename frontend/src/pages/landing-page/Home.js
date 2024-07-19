import React from "react";
import { useSelector } from "react-redux";

import LoginForm from "../../components/Auth/Login";
import DashboardHome from "../../components/dashboard/components/Home/Home";

const HomePage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return <>{!isAuthenticated ? <LoginForm /> : <DashboardHome />}</>;
};

export default HomePage;
