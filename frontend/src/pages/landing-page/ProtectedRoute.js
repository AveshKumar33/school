import React, { useEffect } from "react";
// import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedUserTypes }) => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userType = useSelector((state) => state.auth.userType);

  useEffect(() => {
    if (!isAuthenticated || !allowedUserTypes.includes(userType)) {
      navigate("/");
    }
  }, [isAuthenticated, userType, allowedUserTypes, navigate]);

  if (isAuthenticated && allowedUserTypes.includes(userType)) {
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoute;
