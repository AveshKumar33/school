import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import Route from "../../components/TransportRoute/Route";

const AccountPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Routes"));
  }, [dispatch]);

  return <Route />;
};

export default AccountPage;
