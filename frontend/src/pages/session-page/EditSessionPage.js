import React, { Suspense } from "react";
import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { toast } from "react-toastify";

import instance from "../../util/axios/config";
import SessionForm from "../../components/Master/Session/SessionForm";

const EditSessionFormPage = () => {
  const { data } = useRouteLoaderData("session-data");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(data) => <SessionForm editedData={data} method="put" />}
      </Await>
    </Suspense>
  );
};

export const loadData = async (id) => {
  try {
    const response = await instance.get("/session/" + id);
    if (response.status === "failed") {
      return json({ message: "Could not fetch data." }, { status: 500 });
    }
    return response.data.data;
  } catch (error) {
    toast.error(error?.response?.data?.message, {
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

export default EditSessionFormPage;
