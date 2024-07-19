import React, { Suspense } from "react";
import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { toast } from "react-toastify";

import instance from "../../../util/axios/config";
import PaperMapForm from "../../../components/Exam/PaperMap/PaperMapForm";

const PaperMapEditFormPage = () => {
  const { data } = useRouteLoaderData("paper-map-data");
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(loadedData) => <PaperMapForm editedData={loadedData} />}
      </Await>
    </Suspense>
  );
};

export default PaperMapEditFormPage;

export const loadData = async (id) => {
  try {
    const response = await instance.get("/paper-map/" + id);
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
