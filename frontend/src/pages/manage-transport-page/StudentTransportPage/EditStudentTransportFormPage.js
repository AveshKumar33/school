import React, { Suspense, useEffect } from "react";
import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import instance from "../../../util/axios/config";
import { uiAction } from "../../../redux/ui-slice";
import ManageTransportForm from "../../../components/Manage-Transport/Student-Transport/ManageTransportForm";

const EditStudentTransportFormPage = () => {
  const dispatch = useDispatch();

  const { data } = useRouteLoaderData("student-transport-data");

  useEffect(() => {
    dispatch(uiAction.title("Edit Transport Form"));
  }, [dispatch]);

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(loadedData) => <ManageTransportForm editedData={loadedData[0]} />}
      </Await>
    </Suspense>
  );
};

export const loadTransportData = async (id) => {
  try {
    const response = await instance.get("/student-transport/" + id);
    if (response.status === "failed") {
      return json({ message: "Could not fetch data." }, { status: 500 });
    }

    return response?.data?.data;
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
    data: await loadTransportData(id),
  });
}

export default EditStudentTransportFormPage;
