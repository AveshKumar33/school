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

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import { postData, updateDataById } from "../../redux/http-slice";
import CourseTypeList from "./CourseTypeList";
import classes from "./styles.module.css";

const CourseType = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", courseType: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?._id, courseType: editedData?.courseType });
    setValue("courseType", editedData?.courseType);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, courseType } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && courseType !== "") {
        await dispatch(
          updateDataById({ path: "/course-type", id: id, data: courseType })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/course-type", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", courseType: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      courseType: event.target.value,
    }));
    setValue("courseType", event.target.value);
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Course Type" title="Course Type" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.courseType ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Course Type"
                  variant="outlined"
                  name="courseType"
                  value={editValue?.courseType || ""}
                  helperText={errors.courseType ? "Field is required!" : ""}
                  {...register("courseType", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              className={classes["sub-btn"]}
            >
              Save
            </Button>
          </Box>
        </Card>
      </form>

      <Grid className={classes.container}>
        <Card>
          <CardHeader
            subheader="Course Type"
            title="Course Type List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <CourseTypeList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default CourseType;
