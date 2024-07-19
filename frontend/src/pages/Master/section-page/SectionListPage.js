import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { uiAction } from "../../../redux/ui-slice";
import Section from "../../../components/Master/Sections/section";

const SectionListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiAction.title("Section"));
  }, [dispatch]);

  return (
    <>
      <Section />
    </>
  );
};

export default SectionListPage;
