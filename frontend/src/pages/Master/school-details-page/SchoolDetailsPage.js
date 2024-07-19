import React, { Suspense } from "react";
import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { toast } from "react-toastify";

import instance from "../../../util/axios/config";
import SchoolDetails from "../../../components/Master/School-Details/SchoolDetails";

const SchoolDetailsPage = () => {
  const { data } = useRouteLoaderData("school-data");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(data) => <SchoolDetails editedData={data} method="put" />}
      </Await>
    </Suspense>
  );
};

export const loadData = async () => {
  try {
    const response = await instance.get("/school-details");

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

export async function loader() {
  return defer({
    data: await loadData(),
  });
}

export default SchoolDetailsPage;
