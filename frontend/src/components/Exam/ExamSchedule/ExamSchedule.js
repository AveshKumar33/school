import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";

import styles from "../styles.module.css";
import ExamScheduleFilter from "./ExamScheduleFilter";
import ExamScheduleList from "./ExamScheduleList";

const ExamSchedule = () => {
  const [searchData, setSearchData] = useState({
    session: null,
    examType: null,
    standard: null,
    section: [],
    paper: [],
    examName: null,
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/exam/exam-schedule-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <ExamScheduleFilter setSearchData={setSearchData} />
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            title="Exam Schedule"
            subheader="Exam Schedule List"
            className={styles.customCardHeader}
            classes={{
              subheader: styles.customSubheader,
              title: styles.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <ExamScheduleList searchData={searchData} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ExamSchedule;
