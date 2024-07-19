import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import AccountList from "../../components/dashboard/components/Account/AccountList";

const AccountPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Accounts"));
  }, [dispatch]);

  return <AccountList />;
};

export default AccountPage;
