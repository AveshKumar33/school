import React, { Suspense } from "react";
import { useRouteLoaderData, Await, defer } from "react-router-dom";
import { toast } from "react-toastify";

import instance from "../../../util/axios/config";
import ExamScheduleForm from "../../../components/Exam/ExamSchedule/ExamScheduleForm";

const ExamScheduleEditFormPage = () => {
  const { data } = useRouteLoaderData("exam-schedule-data");
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading....</p>}>
      <Await resolve={data}>
        {(loadedData) => <ExamScheduleForm editedData={loadedData[0]} />}
      </Await>
    </Suspense>
  );
};

export default ExamScheduleEditFormPage;

export const loadData = async (id) => {
  try {
    const response = await instance.get("/exam-schedule/" + id);
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
