import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { toast } from "react-toastify";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { postData, updateDataById } from "../../../redux/http-slice";
import AddExamList from "./AddExamList";
import classes from "../styles.module.css";

const AddExam = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({
    id: "",
    examName: "",
    description: "",
  });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({
      id: editedData?._id,
      examName: editedData?.examName,
      description: editedData?.description,
    });
    setValue("examName", editedData?.examName);
    setValue("description", editedData?.description);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "") {
        await dispatch(
          updateDataById({ path: "/add-exam", id: id, data: data })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/add-exam", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", examName: "", description: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            title="Add Exam"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.examName ? true : false}
                  focused={editValue?.examName !== "" ? true : false}
                  id="examName"
                  size="small"
                  label="Exam Name/Title"
                  variant="outlined"
                  name="examName"
                  helperText={errors.examName ? "Field is required!" : ""}
                  {...register("examName", { required: true })}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.description ? true : false}
                  focused={editValue?.description !== "" ? true : false}
                  id="description"
                  size="small"
                  label="Exam Description"
                  variant="outlined"
                  name="description"
                  helperText={errors.description ? "Field is required!" : ""}
                  {...register("description", { required: true })}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Card>
      </form>

      <Grid className={classes.container}>
        <Card>
          <CardHeader
            subheader="Account Groups"
            title="Account Group List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <AddExamList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default AddExam;
