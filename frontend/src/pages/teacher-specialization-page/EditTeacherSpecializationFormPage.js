import React, { Suspense } from "react";
import { useRouteLoaderData, Await, defer, json } from "react-router-dom";
import { toast } from "react-toastify";

import instance from "../../util/axios/config";
import TeacherSpecializationForm from "../../components/Teacher-Specialization/TeacherSpecializationForm";

const EditTeacherSpecializationFormPage = () => {
  const { teacherData } = useRouteLoaderData("teacher-specialization-details");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={teacherData}>
        {(loadedData) => (
          <TeacherSpecializationForm editedData={loadedData[0]} />
        )}
      </Await>
    </Suspense>
  );
};

export const loadTeacherData = async (id) => {
  try {
    const response = await instance.get("/teacher-specialization/" + id);
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
    teacherData: await loadTeacherData(id),
  });
}

export default EditTeacherSpecializationFormPage;
