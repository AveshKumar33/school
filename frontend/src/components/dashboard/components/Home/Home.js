import React from "react";
import { useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import Orders from "../Orders";
import AssignmentList from "../AssignmentList/AssignmentList";

import TotalStudent from "../Weights/Student";
import TotalTeachers from "../Weights/Teacher";
import TotalBranch from "../Weights/TotalBranch";
import ToalStaff from "../Weights/SchoolStaff";

import {
  options as studentOption,
  data as studentData,
} from "../Chart/StudentChart";

import {
  options as teacherOption,
  data as teacherData,
} from "../Chart/TeacherChart";

import { Bar } from "react-chartjs-2";

const Home = () => {
  const userType = useSelector((state) => state.auth.userType);

  return (
    <>
      <Grid item xs={12} md={6} lg={3}>
        <TotalStudent />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TotalTeachers />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <TotalBranch />
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <ToalStaff />
      </Grid>{" "}
      {/* Growth Chart*/}
      <Grid item xs={12} md={12} lg={6}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Bar options={teacherOption} data={teacherData} />
        </Paper>
      </Grid>
      {/* Student Chart*/}
      <Grid item xs={12} md={12} lg={6}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Bar options={studentOption} data={studentData} />
        </Paper>
      </Grid>
      {userType === "teacher" && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <AssignmentList />
          </Paper>
        </Grid>
      )}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Orders />
        </Paper>
      </Grid>
    </>
  );
};

export default Home;
