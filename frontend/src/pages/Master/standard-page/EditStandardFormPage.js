import React, { useEffect, Suspense } from "react";
import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import instance from "../../../util/axios/config";
import { uiAction } from "../../../redux/ui-slice";
import StandardForm from "../../../components/Master/Standard/standardForm";

const EditStandardFormPage = () => {
  const dispatch = useDispatch();
  const { data } = useRouteLoaderData("standard-data");

  useEffect(() => {
    dispatch(uiAction.title("Standard Form"));
  }, [dispatch]);

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(loadedData) => <StandardForm editedData={loadedData} />}
      </Await>
    </Suspense>
  );
};

export const loadData = async (id) => {
  try {
    const response = await instance.get("/standard/" + id);
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
    data: await loadData(id),
  });
}

export default EditStandardFormPage;
