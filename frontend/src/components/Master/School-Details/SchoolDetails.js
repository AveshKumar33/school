import React, { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";

import { UploadLogo } from "./UploadLogo";
import {
  postDataWithFile,
  updateDataWithFile,
} from "../../../redux/http-slice";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import styles from "./styles.module.css";

const SchoolDetails = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const httpErrorHandler = useHttpErrorHandler();

  const [logo, setLogo] = useState(null);
  const [editedValue, setEditedValue] = useState({
    id: "",
    UDISECode: "",
    address: "",
    email: "",
    logo: "",
    mobileNo: null,
    name: "",
    otherMobileNo: null,
  });

  useEffect(() => {
    if (editedData) {
      setEditedValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
        UDISECode: editedData?.UDISECode,
        address: editedData?.address,
        email: editedData?.email,
        logo: editedData?.logo,
        mobileNo: editedData?.mobileNo,
        name: editedData?.name,
        otherMobileNo: editedData?.otherMobileNo,
      }));

      setValue("name", editedData?.name);
      setValue("UDISECode", editedData?.UDISECode);
      setValue("address", editedData?.address);
      setValue("email", editedData?.email);
      setValue("mobileNo", editedData?.mobileNo);
      setValue("otherMobileNo", editedData?.otherMobileNo);
    }
  }, [editedData, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("data", JSON.stringify(data));

    try {
      if (editedValue?.id === "") {
        dispatch(
          postDataWithFile({ path: "/school-details", data: formData })
        ).unwrap();
      } else if (editedValue?.id) {
        dispatch(
          updateDataWithFile({
            path: "/school-details",
            id: editedValue?.id,
            data: formData,
          })
        ).unwrap();
      }
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles["main-container"]}
        style={{ minHeight: "80vh" }}
      >
        <Grid container spacing={2} wrap="wrap">
          <Grid item md={3} sm={12} xs={12}>
            <Card>
              <CardContent>
                <Grid
                  item
                  md={12}
                  sm={12}
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <UploadLogo
                    onDrop={(file) => {
                      setLogo(file[0]);
                    }}
                    fileAccept=".jpg, .jpeg, .png"
                    inpId="logoUpload"
                    name="logo"
                    existingFile={
                      editedValue?.logo ? `School/${editedValue?.logo}` : ""
                    }
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography mt={1} variant="h5" gutterBottom align="center">
                    {editedValue?.name ? editedValue?.name : ""}
                  </Typography>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Typography variant="h6" gutterBottom align="center">
                    {editedValue?.address ? editedValue?.address : ""}
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            md={9}
            sm={12}
            xs={12}
            className={styles["main-container"]}
          >
            <Card>
              <CardHeader
                subheader="The information can be edited"
                title="School Details"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2} wrap="wrap">
                  <Grid item md={6} sm={6} xs={12}>
                    <TextField
                      className={styles.textField}
                      error={errors.name ? true : false}
                      id="schoolName"
                      label="School Name"
                      variant="outlined"
                      name="name"
                      //   value={editValue?.stoppageName || ""}
                      helperText={errors.name ? "Field is required!" : ""}
                      {...register("name", { required: true })}
                      //   onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <TextField
                      className={styles.textField}
                      error={errors.UDISECode ? true : false}
                      id="UDISECode"
                      label="School UDISE Code"
                      variant="outlined"
                      name="UDISECode"
                      //   value={editValue?.stoppageName || ""}
                      helperText={errors.UDISECode ? "Field is required!" : ""}
                      {...register("UDISECode", { required: true })}
                      //   onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <TextField
                      className={styles.textField}
                      error={errors.email ? true : false}
                      id="schoolEmail"
                      label="Email"
                      variant="outlined"
                      type="email"
                      name="email"
                      //   value={editValue?.stoppageName || ""}
                      helperText={errors.email ? "Field is required!" : ""}
                      {...register("email", { required: true })}
                      //   onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <TextField
                      className={styles.textField}
                      error={errors.mobileNo ? true : false}
                      id="mobileNo"
                      label="Mobile Number"
                      type="number"
                      variant="outlined"
                      name="mobileNo"
                      //   value={editValue?.stoppageName || ""}
                      helperText={errors.mobileNo ? "Field is required!" : ""}
                      {...register("mobileNo", { required: true })}
                      //   onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <TextField
                      className={styles.textField}
                      id="mobileNo"
                      type="number"
                      label="Other Mobile Number"
                      variant="outlined"
                      name="otherMobileNo"
                      //   value={editValue?.stoppageName || ""}
                      {...register("otherMobileNo")}
                      //   onChange={handleChange}
                    />
                  </Grid>
                  <Grid item md={6} sm={6} xs={12}>
                    <TextField
                      className={styles.textField}
                      error={errors.address ? true : false}
                      id="address"
                      label="Address"
                      variant="outlined"
                      name="address"
                      helperText={errors.address ? "Field is required!" : ""}
                      //   value={editValue?.stoppageName || ""}
                      {...register("address", { required: true })}
                      //   onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box display="flex" justifyContent="flex-end" p={2}>
                <Button color="primary" type="submit" variant="contained">
                  {editedValue?.id ? "Update" : "Save"}
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default SchoolDetails;
