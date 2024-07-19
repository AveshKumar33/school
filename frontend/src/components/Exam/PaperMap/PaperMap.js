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
import PaperMapFilter from "./PaperMapFilter";
import PaperMapList from "./PaperMapList";

const PaperMap = () => {
  const [searchData, setSearchData] = useState({
    session: null,
    examType: null,
    examName: null,
    standard: null,
    section: [],
    paper: [],
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
              to="/exam/paper-map-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <PaperMapFilter setSearchData={setSearchData} />
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            title="Papers"
            subheader="Standard Section Paper Map List"
            className={styles.customCardHeader}
            classes={{
              subheader: styles.customSubheader,
              title: styles.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <PaperMapList searchData={searchData} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default PaperMap;
