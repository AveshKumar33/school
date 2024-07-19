import React from "react";

// Material components
import { Typography } from "@mui/material";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import Paper from "@mui/material/Paper";

// Component styles
import theme from "../theme/index";
import classes from "./styles.module.css";

const TotalBranch = () => {
  return (
    <Paper
      sx={{
        p: 3,
        // display: "flex",
        // flexDirection: "column",
        //  height: 240
      }}
    >
      <div className={classes.content}>
        <div className={classes.details}>
          <Typography
            style={{ color: theme.palette.text.secondary }}
            className={classes.title}
            variant="body2"
          >
            BRANCHES
          </Typography>
          <Typography sx={{ mt: 2 }} className={classes.value} variant="h4">
            63
          </Typography>
        </div>
        <div
          style={{ backgroundColor: theme.palette.secondary.dark }}
          className={classes.iconWrapper}
        >
          <HomeWorkIcon
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
          43%
        </Typography>
        <Typography style={{ marginLeft: "3px" }} variant="caption">
          Since last years
        </Typography>
      </div>
    </Paper>
  );
};

export default TotalBranch;
