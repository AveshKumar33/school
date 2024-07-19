import React, { useEffect, Suspense } from "react";
import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import instance from "../../util/axios/config";
import { uiAction } from "../../redux/ui-slice";
import Account from "../../components/dashboard/components/Account/Account";

const EditAccountFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Update Account"));
  }, [dispatch]);

  const { accountData } = useRouteLoaderData("account-data");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={accountData}>
        {(loadedData) => <Account value={loadedData} method="put" />}
      </Await>
    </Suspense>
  );
};

export const loadAccountData = async (id) => {
  try {
    const response = await instance.get("/account/" + id);
    if (response.status === "failed") {
      return json({ message: "Could not fetch data." }, { status: 500 });
    }
    return response.data.data;
  } catch (error) {
    toast.error(error, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  }
};

export async function loader({ params }) {
  const id = params.id;
  return defer({
    accountData: await loadAccountData(id),
  });
}

export default EditAccountFormPage;
