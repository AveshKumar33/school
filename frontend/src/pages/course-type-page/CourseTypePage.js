import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../redux/ui-slice";
import CourseType from "../../components/Course-Type/CourseType";

const CourseTypePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Course Type"));
  }, [dispatch]);

  return (
    <>
      <CourseType />
    </>
  );
};

export default CourseTypePage;
