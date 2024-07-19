import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import Account from "../../components/dashboard/components/Account/Account";

const AccountFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Add Account"));
  }, [dispatch]);

  return <Account />;
};

export default AccountFormPage;
