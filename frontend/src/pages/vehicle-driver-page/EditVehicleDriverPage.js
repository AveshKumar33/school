import React, { useEffect, Suspense } from "react";
import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import instance from "../../util/axios/config";
import { uiAction } from "../../redux/ui-slice";
import VehicleDriverForm from "../../components/Vehicle-Driver/VehicleDriverForm";

const EditVehicleDriverFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Update Account"));
  }, [dispatch]);

  const { data } = useRouteLoaderData("driver-data");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(data) => <VehicleDriverForm value={data} method="put" />}
      </Await>
    </Suspense>
  );
};

export const loadData = async (id) => {
  try {
    const response = await instance.get("/vehicle-driver/" + id);
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
    data: await loadData(id),
  });
}

export default EditVehicleDriverFormPage;
