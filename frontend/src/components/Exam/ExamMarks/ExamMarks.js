import React, { useState, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

import { Grid } from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import ExamFilter from "./ExamFilter";
import instance from "../../../util/axios/config";
import Marks from "./Marks";
import classes from "../styles.module.css";

const ExamMarks = () => {
  const [searchData, setSearchData] = useState({
    session: null,
    standard: null,
    section: null,
    exam: null,
    papers: [],
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ students: [], examPaperMap: [] });

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const dispatch = useDispatch();

  const fetchData = useMemo(
    () => async () => {
      try {
        setLoading(true);
        const response = await instance.get(
          "/student/name?search=" + JSON.stringify(searchData)
        );

        const students = response.data.data;
        //   const allPapers = [...student.paper, ...student.additionalPaper];
        //   const paperMarksDetails = [];

        //   allPapers.forEach((paper) => {
        //     const paperId = paper?._id;
        //     const paperDetails = paperDetailsMap?.get(paperId);
        //     if (paperDetails) {
        //       paperMarksDetails.push({
        //         paperId: paperId,
        //         paperName: paper.paper,
        //         minMarks: paperDetails.minMarks,
        //         maxMarks: paperDetails.maxMarks,
        //         weightage: paperDetails.weightage,
        //       });
        //     }
        //   });

        //   return {
        //     ...student,
        //     paper: paperMarksDetails,
        //   };
        // });

        setData((prevData) => ({
          ...prevData,
          students: students,
        }));
        setExpanded(false);
        setLoading(false);
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          setLoading(false);
          dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          setLoading(false);
        }
      }
    },
    [dispatch, searchData]
  );

  // fetch student
  useEffect(() => {
    if (
      searchData?.session &&
      searchData?.standard &&
      searchData?.section &&
      searchData?.exam
    ) {
      fetchData();
    }
  }, [dispatch, searchData, fetchData]);

  return (
    <>
      <ExamFilter setSearchData={setSearchData} setData={setData} />
      <Grid className={classes.container} style={{ minHeight: "50vh" }}>
        {!loading ? (
          data?.students &&
          data?.students.length > 0 &&
          data?.students?.map((student, index) => (
            <Marks
              key={student?._id}
              expanded={expanded === `${student?._id}`}
              handleChange={handleChange}
              student={student}
              index={index}
              examPaperMap={data?.examPaperMap}
              exam={searchData?.exam}
              session={searchData?.session}
            />
          ))
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default ExamMarks;
