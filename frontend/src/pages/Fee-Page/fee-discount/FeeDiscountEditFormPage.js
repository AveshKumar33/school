import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { Suspense } from "react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { uiAction } from "../../../redux/ui-slice";
import axios from "../../../util/axios/config";
import FeeDiscountForm from "../../../components/Fee/Fee-Discount/FeeDiscountForm";

const FeeDiscountEditFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Fee Discount Update"));
  }, [dispatch]);

  const { feeData } = useRouteLoaderData("fee-discount-details");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={feeData}>
        {(loadedData) => <FeeDiscountForm editedData={loadedData} />}
      </Await>
    </Suspense>
  );
};

export const loadFeeData = async (id) => {
  try {
    const response = await axios.get("/fee-discount/" + id);
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

export default FeeDiscountEditFormPage;
