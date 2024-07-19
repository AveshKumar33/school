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
import EnquiryPurposeList from "./EnquiryPurposeList";
import classes from "./styles.module.css";

const EnquiryPurpose = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({ id: "", purpose: "" });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({
      id: editedData?._id,
      purpose: editedData?.purpose,
    });
    setValue("purpose", editedData?.purpose);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id, purpose } = editValue;

  const onSubmit = async (data) => {
    try {
      if (id !== "" && purpose !== "") {
        await dispatch(
          updateDataById({ path: "/enquiry-purpose", id: id, data })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/enquiry-purpose", data })).unwrap();
      }
      reset();
      setEditValue({ id: "", purpose: "" });
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
            subheader="Add Enquiry Purpose"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.purpose ? true : false}
                  focused={Boolean(editValue?.purpose)}
                  id="purpose"
                  size="small"
                  label="Enquiry Purpose"
                  variant="outlined"
                  name="purpose"
                  helperText={errors.purpose ? "Field is required!" : ""}
                  {...register("purpose", { required: true })}
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
            subheader="Enquiry Purpose"
            title="Enquiry Purpose List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <EnquiryPurposeList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default EnquiryPurpose;
