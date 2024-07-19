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
import ExamTypeList from "./ExamTypeList";
import classes from "../styles.module.css";

const ExamType = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", examType: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?._id, examType: editedData?.examType });
    setValue("examType", editedData?.examType);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, examType } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && examType !== "") {
        await dispatch(
          updateDataById({ path: "/exam-type", id: id, data })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/exam-type", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", examType: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader
            className={classes.customCardHeader}
            classes={{
              title: classes.customSubheader,
              subheader: classes.customTitle,
            }}
            subheader="Add Exam Type"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.examType ? true : false}
                  focused={Boolean(editValue?.examType)}
                  id="examType"
                  size="small"
                  label="Exam Type"
                  variant="outlined"
                  name="examType"
                  helperText={errors.examType ? "Field is required!" : ""}
                  {...register("examType", { required: true })}
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
            subheader="Exam Type"
            title="Exam Type List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <ExamTypeList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ExamType;
