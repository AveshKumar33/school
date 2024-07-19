import { useRouteLoaderData, Await, defer } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Suspense } from "react";
import { toast } from "react-toastify";

import { uiAction } from "../../redux/ui-slice";
import instance from "../../util/axios/config";
import EditStudentForm from "../../components/Student/EditStudentForm";

const EditStudentFormPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Update Admission"));
  }, [dispatch]);

  const { student, feeRecord } = useRouteLoaderData("student-details");

  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={[student, feeRecord]}>
        {([loadedStudent, loadedFeeRecord]) => (
          <EditStudentForm
            stuData={loadedStudent[0]}
            feeRecordData={loadedFeeRecord}
          />
        )}
      </Await>
    </Suspense>
  );
};

export const loadStudentData = async (id, sessionName) => {
  try {
    const response = await instance.get(
      "/student/" + id + "?search=" + JSON.stringify({ session: sessionName })
    );
    return response?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data.message || "Something went wrong", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  }
};

export const loadFeeRecordData = async (id, sessionName) => {
  try {
    const response = await instance.get(
      "/fee-record/all?search=" +
        JSON.stringify({ student: id, session: sessionName })
    );

    return response?.data?.data;
  } catch (error) {
    toast.error(error?.response?.data.message || "Something went wrong", {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 2000,
      hideProgressBar: true,
      theme: "colored",
    });
  }
};

export async function loader({ request, params }) {
  const id = params.id;
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search");

  return defer({
    student: await loadStudentData(id, searchQuery),
    feeRecord: await loadFeeRecordData(id, searchQuery),
  });
}

export default EditStudentFormPage;
