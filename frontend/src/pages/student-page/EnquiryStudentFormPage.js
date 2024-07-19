import React, { useEffect, Suspense } from "react";
import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { useDispatch } from "react-redux";
import instance from "../../util/axios/config";
import { toast } from "react-toastify";

import { uiAction } from "../../redux/ui-slice";
import StudentForm from "../../components/Student/StudentForm";

const EnquiryStudentFormPage = () => {
  const dispatch = useDispatch();
  const { student } = useRouteLoaderData("enquiary-student-details");

  useEffect(() => {
    dispatch(uiAction.title("Admission Form"));
  }, [dispatch]);

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={student}>
        {(loadedData) => <StudentForm stuData={loadedData} />}
      </Await>
    </Suspense>
  );
};

export const loadEnquiryStudentData = async (id) => {
  try {
    const response = await instance.get("/post-enquiry/" + id);
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
    student: await loadEnquiryStudentData(id),
  });
}

export default EnquiryStudentFormPage;
