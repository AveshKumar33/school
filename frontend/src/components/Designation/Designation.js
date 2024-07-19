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

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import { postData, updateDataById } from "../../redux/http-slice";
import DesigList from "./DesigList";
import classes from "./styles.module.css";

const Designation = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", title: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?._id, title: editedData?.title });
    setValue("title", editedData?.title);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, title } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && title !== "") {
        await dispatch(
          updateDataById({ path: "/designation", id: id, data: title })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/designation", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", title: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      title: event.target.value,
    }));
    setValue("title", event.target.value);
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Designation" title="Designation" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.title ? true : false}
                  id="title"
                  size="small"
                  label="Designation"
                  variant="outlined"
                  name="title"
                  value={editValue?.title || ""}
                  helperText={errors.title ? "Field is required!" : ""}
                  {...register("title", { required: true })}
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
            subheader="Designation"
            title="Designation List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <DesigList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Designation;
