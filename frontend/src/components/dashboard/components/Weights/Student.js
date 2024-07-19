import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

// Material components
import { Typography } from "@mui/material";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
// import MoneyIcon from "@mui/icons-material/Money";
import Paper from "@mui/material/Paper";

// Component styles
import theme from "../theme/index";
import classes from "./styles.module.css";
import { authActions } from "../../../../redux/auth-slice";
import instance from "../../../../util/axios/config";

const TotalStudent = () => {
  const dispatch = useDispatch();
  const [totalStudentCount, setTotalStudentCount] = useState(0);

  useEffect(() => {
    const fetchTotalStudent = async () => {
      try {
        const {
          data: { totalData },
        } = await instance.get("/student/count");

        setTotalStudentCount(totalData);
      } catch (error) {
        if (error?.response?.data?.status === 401 || error?.response?.data?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    fetchTotalStudent();
  }, [dispatch]);

  return (
    <Paper sx={{ p: 3 }}>
      <div className={classes.content}>
        <div className={classes.details}>
          <Typography
            style={{ color: theme.palette.text.secondary }}
            className={classes.title}
            variant="body2"
          >
            STUDENTS
          </Typography>
          <Typography sx={{ mt: 2 }} className={classes.value} variant="h4">
            {totalStudentCount}
          </Typography>
        </div>
        <div
          style={{ backgroundColor: theme.palette.success.dark }}
          className={classes.iconWrapper}
        >
          <SupervisorAccountIcon
            style={{ color: theme.palette.common.white }}
            className={classes.icon}
          />
        </div>
      </div>
      <div style={{ marginTop: "10px" }} className={classes.footer}>
        <Typography
          style={{ color: theme.palette.success.dark }}
          className={classes.difference}
          variant="body2"
        >
          <ArrowUpwardIcon />
          12%
        </Typography>
        <Typography style={{ marginLeft: "3px" }} variant="caption">
          Since last month
        </Typography>
      </div>
    </Paper>
  );
};

export default TotalStudent;
