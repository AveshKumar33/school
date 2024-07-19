import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

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
import TeachingTypeList from "./TeachingTypeList";
import classes from "./styles.module.css";

const TeachingType = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", type: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?._id, type: editedData?.type });
    setValue("type", editedData?.title);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, type } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && type !== "") {
        await dispatch(
          updateDataById({ path: "/teaching-type", id: id, data: type })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/teaching-type", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", type: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setValue("type", event.target.value);
    setEditValue((prevSate) => ({
      ...prevSate,
      type: event.target.value,
    }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Teaching Type" title="Teaching Type" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.type ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Type"
                  variant="outlined"
                  name="type"
                  value={editValue?.type || ""}
                  helperText={errors.type ? "Field is required!" : ""}
                  {...register("type", { required: true })}
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
            subheader="Teaching Type"
            title="Teaching Type List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <TeachingTypeList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default TeachingType;
