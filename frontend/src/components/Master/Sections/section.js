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
import SectionList from "./SectionList";
import classes from "./styles.module.css";

const Section = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", section: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({ id: editedData?._id, section: editedData?.section });
    setValue("section", editedData?.section);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, section } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && section !== "") {
        await dispatch(
          updateDataById({ path: "/section", id: id, data: section })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/section", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", section: "" });
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setEditValue((prevSate) => ({ ...prevSate, section: event.target.value }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Section" title="Section" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.section ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Section name"
                  variant="outlined"
                  name="section"
                  value={editValue?.section || ""}
                  helperText={errors.section ? "Field is required!" : ""}
                  {...register("section", { required: true })}
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
            subheader="Section"
            title="Section List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <SectionList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Section;
