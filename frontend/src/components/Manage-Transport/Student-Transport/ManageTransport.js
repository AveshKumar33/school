import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@mui/material";

import ManageTransportList from "./ManageTransportList";
import styles from "../styles.module.css";

const ManageTransport = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/student/transport-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <ManageTransportList />
    </>
  );
};

export default ManageTransport;
