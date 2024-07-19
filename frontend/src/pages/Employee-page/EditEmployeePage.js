import React, { useEffect } from "react";
import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";

import instance from "../../util/axios/config";
// import EditEmployeeForm from "../../components/Employee/EditEmployeeForm";
import EmployeeForm from "../../components/Employee/EmployeeForm";
import { Suspense } from "react";

const EditEmployeeFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Edit Employee"));
  }, [dispatch]);

  const { employee } = useRouteLoaderData("employee-details");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={employee}>
        {/* {(loadedData) => <EditEmployeeForm value={loadedData} />} */}
        {(loadedData) => <EmployeeForm editedData={loadedData} />}
      </Await>
    </Suspense>
  );
};

export const loadEmployeeData = async (id) => {
  try {
    const response = await instance.get("/employee/" + id);
    // if (!response.ok) {
    //   return json({ message: "Could not fetch data." }, { status: 500 });
    // }
    return response.data.data;
  } catch (error) {
    console.log(error);
  }
};

export async function loader({ params }) {
  const id = params.id;
  return defer({
    employee: await loadEmployeeData(id),
  });
}

export default EditEmployeeFormPage;
