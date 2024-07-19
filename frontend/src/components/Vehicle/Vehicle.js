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

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import { postData, updateDataById } from "../../redux/http-slice";
import VehicleList from "./VehicleList";
import classes from "./styles.module.css";

const Vehicle = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const initialState = {
    id: "",
    vehicleNumber: "",
    IMEI_No: "",
    totalSeats: null,
    maximumAllowed: null,
    insuranceCompany: "",
    insuranceDate: null,
    pollutionCertficateDate: null,
    fitnessCertficateDate: null,
    serviceDueDate: null,
    permitValidDate: null,
  };

  const [editValue, setEditValue] = useState(initialState);
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const initialDateState = {
    insuranceDate: null,
    pollutionCertficateDate: null,
    fitnessCertficateDate: null,
    serviceDueDate: null,
    permitValidDate: null,
  };
  const [date, setDate] = useState(initialDateState);

  const onEditHandler = (data) => {
    setEditValue((prevState) => ({
      ...prevState,
      id: data?._id,
      vehicleNumber: data?.vehicleNumber,
      IMEI_No: data?.IMEI_No,
      totalSeats: data?.totalSeats,
      maximumAllowed: data?.maximumAllowed,
      insuranceCompany: data?.insuranceCompany,
      insuranceDate: data?.insuranceDate,
      pollutionCertficateDate: data?.pollutionCertficateDate,
      fitnessCertficateDate: data?.fitnessCertficateDate,
      serviceDueDate: data?.serviceDueDate,
      permitValidDate: data?.permitValidDate,
    }));
    setValue("vehicleNumber", data?.vehicleNumber);
    setValue("IMEI_No", data?.IMEI_No);
    setValue("totalSeats", data?.totalSeats);
    setValue("maximumAllowed", data?.maximumAllowed);
    setValue("insuranceCompany", data?.insuranceCompany);

    setDate({
      insuranceDate: data?.insuranceDate,
      pollutionCertficateDate: data?.pollutionCertficateDate,
      fitnessCertficateDate: data?.fitnessCertficateDate,
      serviceDueDate: data?.serviceDueDate,
      permitValidDate: data?.permitValidDate,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { id } = editValue;

  const onSubmit = async (data) => {
    try {
      const insuranceDate = date.insuranceDate
        ? dayjs(date.insuranceDate).format("YYYY-MM-DD")
        : "";

      const permitValidDate = date.permitValidDate
        ? dayjs(date.permitValidDate).format("YYYY-MM-DD")
        : "";
      const pollutionCertficateDate = date.pollutionCertficateDate
        ? dayjs(date.pollutionCertficateDate).format("YYYY-MM-DD")
        : "";

      const serviceDueDate = date.serviceDueDate
        ? dayjs(date.serviceDueDate).format("YYYY-MM-DD")
        : "";

      const fitnessCertficateDate = date.fitnessCertficateDate
        ? dayjs(date.fitnessCertficateDate).format("YYYY-MM-DD")
        : "";

      const formData = {
        ...data,
        insuranceDate,
        permitValidDate,
        pollutionCertficateDate,
        serviceDueDate,
        fitnessCertficateDate,
      };

      if (id !== "") {
        await dispatch(
          updateDataById({
            path: "/vehicle-details",
            id: id,
            data: formData,
          })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/vehicle-details", data: formData })
        ).unwrap();
      }
      reset();
      setEditValue(initialState);
      setDate(initialDateState);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Vehicle Details" title="Vehicle Details" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors?.vehicleNumber ? true : false}
                  id="outlined-basic2"
                  type="text"
                  size="small"
                  label="Vehicle Number"
                  variant="outlined"
                  name="vehicleNumber"
                  value={editValue?.vehicleNumber || ""}
                  helperText={errors.vehicleNumber ? "Field is required!" : ""}
                  {...register("vehicleNumber", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.IMEI_No ? true : false}
                  id="outlined-basic2"
                  size="small"
                  label="Device ID or IMEI NO"
                  variant="outlined"
                  name="IMEI_No"
                  value={editValue?.IMEI_No || ""}
                  helperText={errors.IMEI_No ? "Field is required!" : ""}
                  {...register("IMEI_No", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.totalSeats ? true : false}
                  size="small"
                  type="Number"
                  id="outlined-basic"
                  label="Total seats"
                  variant="outlined"
                  name="totalSeats"
                  value={editValue?.totalSeats || ""}
                  helperText={errors.totalSeats ? "Field is required!" : ""}
                  {...register("totalSeats", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.maximumAllowed ? true : false}
                  size="small"
                  type="Number"
                  id="outlined-basic"
                  label="Maximum Allowed"
                  variant="outlined"
                  name="maximumAllowed"
                  value={editValue?.maximumAllowed || ""}
                  helperText={errors.maximumAllowed ? "Field is required!" : ""}
                  {...register("maximumAllowed", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.insuranceDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    error={false}
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                      error={false}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          value={date.insuranceDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              insuranceDate: newValue.format(),
                            }))
                          }
                          label="Insurance Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.insuranceDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              insuranceDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(date?.insuranceDate || null)}
                          label="Insurance Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.insuranceCompany ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="Insurance Company"
                  variant="outlined"
                  name="insuranceCompany"
                  value={editValue?.insuranceCompany || ""}
                  helperText={
                    errors.insuranceCompany ? "Field is required!" : ""
                  }
                  {...register("insuranceCompany", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.pollutionCertficateDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    error={false}
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                      error={false}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          value={date.pollutionCertficateDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              pollutionCertficateDate: newValue.format(),
                            }))
                          }
                          label="Pollution Certficate Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.pollutionCertficateDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              pollutionCertficateDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(
                            date?.pollutionCertficateDate || null
                          )}
                          label="Pollution Certficate Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.fitnessCertficateDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    error={false}
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                      error={false}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          value={date.fitnessCertficateDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              fitnessCertficateDate: newValue.format(),
                            }))
                          }
                          label="Fitness Certficate Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.fitnessCertficateDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              fitnessCertficateDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(
                            date?.fitnessCertficateDate || null
                          )}
                          label="Fitness Certficate Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.serviceDueDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    error={false}
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                      error={false}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          value={date.serviceDueDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              serviceDueDate: newValue.format(),
                            }))
                          }
                          label="Service Due Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.serviceDueDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              serviceDueDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(date?.serviceDueDate || null)}
                          label="Service Due Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.permitValidDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    error={false}
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                      error={false}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          value={date.permitValidDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              permitValidDate: newValue.format(),
                            }))
                          }
                          label="Permit Valid Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.permitValidDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
                    locale="en"
                    timeZone="Asia/Kolkata"
                  >
                    <DemoContainer
                      components={["DatePicker"]}
                      className={classes.dateInp}
                      sx={{ width: "100%", mt: -1.5 }}
                    >
                      <DemoItem className={classes.dateInp}>
                        <DatePicker
                          sx={{
                            width: "100%",
                            "& .MuiInputBase-input": {
                              height: "9px",
                            },
                          }}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              permitValidDate: newValue.format(),
                            }))
                          }
                          defaultValue={dayjs(date?.permitValidDate || null)}
                          label="Permit Valid Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
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
            subheader="Vehicle Detalis"
            title="Vehicle Detalis List"
          />
          <Divider />
          <CardContent>
            <VehicleList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Vehicle;
