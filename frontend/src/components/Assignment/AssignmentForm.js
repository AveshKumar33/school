import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";

import { addAssignment } from "../../redux/assignment-slice";
import { authActions } from "../../redux/auth-slice";
import { AssignmentUpload } from "./FileUpload";
import InputIndex from "./InputIndex";
import classes from "./Styles.module.css";

const AssignmentForm = () => {
  const dispatch = useDispatch();

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedValue, setSelectedValues] = useState({});
  const user = useSelector((state) => state.auth.user);

  const { error, isLoading } = useSelector((state) => state.assignment);

  useEffect(() => {
    if (error?.status === 401 || error?.status === 500) {
      toast.error("Please login again!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      dispatch(authActions.logout());
    }
  }, [dispatch, isLoading, error]);

  const handleSelection = (selectedStandard, selectedSection) => {
    setSelectedValues({ selectedStandard, selectedSection });
  };

  const { _id } = user;

  const handleSubmit = (e) => {
    e.preventDefault();
    const { selectedStandard, selectedSection } = selectedValue;
    const sectionId = selectedSection?.map((section) => section._id);

    if (selectedAssignment && sectionId) {
      const data = {
        standardId: selectedStandard,
        sectionId: sectionId,
        teacherId: _id,
        assignment: selectedAssignment,
      };
      dispatch(addAssignment(data));
    } else {
      toast.error("All filed are required!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="Add Assignment" title="Assignment" />
        <Divider />
        <CardContent>
          <InputIndex onSelection={handleSelection} />
        </CardContent>
        <CardContent>
          <AssignmentUpload
            onDrop={(file) => setSelectedAssignment(file[0])}
            fileAccept=".pdf, .jpg, .jpeg, .png"
            inpId="assignment"
            name="assignment"
          />
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default AssignmentForm;
