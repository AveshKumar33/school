import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Grid,
  Card,
  CardContent,
  //   CardHeader,
  //   Divider,
} from "@mui/material";

import PostEnquiryFilter from "./PostEnquiryFilter";
import PostEnquiryList from "./PostEnquiryList";
import styles from "./styles.module.css";

const PostEnquiry = () => {
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    enquiryPurpose: null,
    session: null,
    standard: null,
    section: null,
  });
  return (
    <>
      <div className={styles["container"]}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/enquiry/post-enquiry-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <PostEnquiryFilter setSearchQuery={setSearchQuery} />
      <Grid className={styles["container"]}>
        <Card>
          <CardContent>
            <PostEnquiryList searchQuery={searchQuery} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default PostEnquiry;
