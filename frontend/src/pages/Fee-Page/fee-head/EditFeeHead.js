import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { Suspense } from "react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { uiAction } from "../../../redux/ui-slice";
import axios from "../../../util/axios/config";
import EditFeeHeadForm from "../../../components/Fee/Fee-Head/EditFeeHeadForm";

const EditFeeHeadFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Fee Head Update"));
  }, [dispatch]);

  const { feeData } = useRouteLoaderData("fee-head-details");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={feeData}>
        {(loadedData) => <EditFeeHeadForm value={loadedData} />}
      </Await>
    </Suspense>
  );
};

export const loadFeeData = async (id) => {
  try {
    const response = await axios.get("/fee-head/" + id);
    if (response.status === "failed") {
      return json({ message: "Could not fetch data." }, { status: 500 });
    }
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong", {
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
    feeData: await loadFeeData(id),
  });
}

export default EditFeeHeadFormPage;
