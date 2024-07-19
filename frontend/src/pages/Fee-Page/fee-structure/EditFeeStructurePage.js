import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { Suspense } from "react";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import axios from "../../../util/axios/config";
import FeeStructureForm from "../../../components/Fee/Fee-Structure/FeeStructureForm";

const EditFeeStructurePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Update Fee Structure"));
  }, [dispatch]);

  const { feeStructure } = useRouteLoaderData("fee-structure-details");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={feeStructure}>
        {(loadedData) => <FeeStructureForm value={loadedData} method="put" />}
      </Await>
    </Suspense>
  );
};

export const loadFeeData = async (id) => {
  try {
    const response = await axios.get("/feestructure/" + id);
    if (response.status === "failed") {
      return json({ message: "Could not fetch data." }, { status: 500 });
    }
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export async function loader({ params }) {
  const id = params.id;
  return defer({
    feeStructure: await loadFeeData(id),
  });
}

export default EditFeeStructurePage;
