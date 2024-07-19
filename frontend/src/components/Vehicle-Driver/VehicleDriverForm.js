import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  Autocomplete,
  TextField,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { authActions } from "../../redux/auth-slice";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import {
  postDataWithFile,
  updateDataWithFile,
  fetchData,
} from "../../redux/http-slice";
import { PhotoUpload } from "../Global/PhotoUpload";
import { Upload } from "../Global/FileUpload";
import classes from "./styles.module.css";

const VehicleDriverForm = ({ value, method }) => {
  const {
    register,
    handleSubmit,
    // reset,
    // setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({
    id: value?._id,
    vehicle: value?.vehicle,
    name: value?.name,
    dateOfBirth: value?.dateOfBirth,
    mobileNo: value?.mobileNo,
    licenceNo: value?.licenceNo,
    aadharNo: value?.aadharNo,
    validTill: value?.validTill,
    contactAddress: value?.contactAddress,
    premanentAddress: value?.premanentAddress,
    referredBy: value?.referredBy,
    aadharCard: value?.aadharCard,
    licence: value?.licence,
    photo: value?.photo,
    method: method,
  });

  const [selectedPhoto, setSelectedPhoto] = useState(editValue?.photo);
  const [selectedLicence, setSelectedLicence] = useState(null);
  const [selectedAadhar, setSelectedAadhar] = useState(null);
  const [validTill, setValidTillDate] = useState(value?.validTill);
  const [dateOfBirth, setDateOfBirth] = useState(value?.validTill);
  const [vehicleData, setVehicleData] = useState();
  const [selectedVehicleData, setSelectedVehicleData] = useState(
    value?.vehicle
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const httpErrorHandler = useHttpErrorHandler();

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  const { data, Loading } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    const path = `/vehicle-details/all`;
    const fetchVehicleDetails = async () => {
      try {
        await dispatch(fetchData({ path })).unwrap();
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchVehicleDetails();
  }, [dispatch]);

  useEffect(() => {
    if (!Loading && data) {
      setVehicleData(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, data]);

  const onSubmit = async (data) => {
    try {
      const date = validTill ? dayjs(validTill).format("YYYY-MM-DD") : "";
      const dob = dateOfBirth ? dayjs(dateOfBirth).format("YYYY-MM-DD") : "";
      const postData = {
        ...data,
        validTill: date,
        dateOfBirth: dob,
        vehicle: selectedVehicleData._id,
      };

      const formData = new FormData();
      formData.append("photo", selectedPhoto);
      formData.append("licence", selectedLicence);
      formData.append("aadharCard", selectedAadhar);
      formData.append("data", JSON.stringify(postData));

      if (method === "put") {
        if (validTill) {
          const id = editValue?.id;
          await dispatch(
            updateDataWithFile({
              path: "/vehicle-driver",
              id: id,
              data: formData,
            })
          ).unwrap();
        } else {
          toast.error("All field are required!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      } else {
        if (selectedPhoto && selectedLicence && selectedAadhar && validTill) {
          await dispatch(
            postDataWithFile({ path: "/vehicle-driver", data: formData })
          ).unwrap();
        } else {
          toast.error("All field are required!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }

      navigate("/vehicle-driver");
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Add Driver" title="Driver Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="highlights-demo"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={vehicleData || []}
                value={selectedVehicleData || null}
                getOptionLabel={(vehicleData) => vehicleData?.vehicleNumber}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedVehicleData(value);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Vehicle" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.vehicleNumber, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.vehicleNumber, matches);

                  return (
                    <li {...props} key={option?._id}>
                      <div>
                        {parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight: part.highlight ? 700 : 400,
                            }}
                          >
                            {part.text}
                          </span>
                        ))}
                      </div>
                    </li>
                  );
                }}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.name ? true : false}
                id="outlined-basic"
                label="Full Name"
                size="small"
                variant="outlined"
                name="name"
                value={editValue?.name || ""}
                helperText={errors.name ? "Field is required!" : ""}
                {...register("name", { required: true })}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} className={classes.dateInp}>
              {!editValue.dateOfBirth && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "100%" }}
                  size="small"
                  className={classes.dateInp}
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    className={classes.dateInp}
                    sx={{ width: "100%" }}
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
                          setDateOfBirth(newValue.format())
                        }
                        label="Date of Birth"
                        className={classes.dateInp}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}

              {editValue.dateOfBirth && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "100%" }}
                  className={classes.dateInp}
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    className={classes.dateInp}
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
                        onChange={(newValue) => setDateOfBirth(newValue)}
                        label="Date of Birth"
                        className={classes.dateInp}
                        defaultValue={dayjs(editValue?.dateOfBirth)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.mobileNo ? true : false}
                size="small"
                id="outlined-basic3"
                label="Mobile Number"
                type="number"
                variant="outlined"
                name="mobileNo"
                value={editValue?.mobileNo || ""}
                helperText={
                  errors.mobileNo ? "Please enter valid mobile no!" : ""
                }
                {...register("mobileNo", {
                  required: true,
                  maxLength: 10,
                })}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.licenceNo ? true : false}
                size="small"
                id="outlined-basic2"
                label="Licence No"
                variant="outlined"
                name="licenceNo"
                value={editValue?.licenceNo || ""}
                helperText={errors.licenceNo ? "Field is required!" : ""}
                {...register("licenceNo", { required: true })}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.aadharNo ? true : false}
                size="small"
                id="outlined-basic3"
                label="Aadhar Number"
                type="number"
                variant="outlined"
                name="aadharNo"
                value={editValue?.aadharNo || ""}
                helperText={
                  errors.aadharNo ? "Please enter valid aadhar no!" : ""
                }
                {...register("aadharNo", {
                  required: true,
                  maxLength: 12,
                })}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} className={classes.dateInp}>
              {!editValue.validTill && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "100%" }}
                  size="small"
                  className={classes.dateInp}
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    className={classes.dateInp}
                    sx={{ width: "100%" }}
                  >
                    <DemoItem className={classes.dateInp}>
                      <DatePicker
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "9px",
                          },
                        }}
                        shouldDisableDate={(day) =>
                          dayjs(day).isBefore(dayjs(), "day")
                        }
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setValidTillDate(newValue.format())
                        }
                        label="Valid till"
                        className={classes.dateInp}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}

              {editValue.validTill && (
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
                  >
                    <DemoItem className={classes.dateInp}>
                      <DatePicker
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "9px",
                          },
                        }}
                        shouldDisableDate={(day) =>
                          dayjs(day).isBefore(dayjs(), "day")
                        }
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setValidTillDate(newValue)}
                        label="Valid till"
                        className={classes.dateInp}
                        defaultValue={dayjs(editValue?.validTill)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.contactAddress ? true : false}
                size="small"
                id="outlined-basic5"
                label="Contact Address"
                variant="outlined"
                name="contactAddress"
                value={editValue?.contactAddress || ""}
                helperText={errors.contactAddress ? "Field is required!" : ""}
                {...register("contactAddress", {
                  required: true,
                })}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.premanentAddress ? true : false}
                size="small"
                id="outlined-basic5"
                label="Premanent Address"
                variant="outlined"
                name="address"
                value={editValue?.premanentAddress || ""}
                helperText={errors.premanentAddress ? "Field is required!" : ""}
                {...register("premanentAddress", {
                  required: true,
                })}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={classes.textField}
                error={errors.referredBy ? true : false}
                size="small"
                id="outlined-basic"
                label="Referred By"
                variant="outlined"
                name="referredBy"
                value={editValue?.referredBy || ""}
                helperText={errors.referredBy ? "Field is required!" : ""}
                {...register("referredBy", {
                  required: true,
                })}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} wrap="wrap" mt={1}>
            <Grid item md={4} sm={6} xs={12}>
              <label style={{ display: "block" }} htmlFor="photo-Upload">
                Photo
              </label>
              <PhotoUpload
                onDrop={(file) => {
                  setSelectedPhoto(file[0]);
                }}
                fileAccept=".jpg, .jpeg, .png"
                inpId="photoUpload"
                name="photo"
                existingFile={
                  editValue?.photo ? `Driver/photo/${editValue?.photo}` : ""
                }
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <label style={{ display: "block" }} htmlFor="licence-upload">
                Licence
              </label>
              <Upload
                onDrop={(file) => {
                  setSelectedLicence(file[0]);
                }}
                fileAccept=".pdf, .jpg, .jpeg, .png"
                inpId="licence"
                name="licence"
                existingFile={
                  editValue?.licence
                    ? `Driver/licence/${editValue?.licence}`
                    : ""
                }
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <label style={{ display: "block" }} htmlFor="aadhar-upload">
                Aadhar Card
              </label>
              <Upload
                onDrop={(file) => {
                  setSelectedAadhar(file[0]);
                }}
                fileAccept=".pdf, .jpg, .jpeg, .png"
                inpId="aadhar"
                name="aadharCard"
                existingFile={
                  editValue.aadharCard
                    ? `Driver/aadhar/${editValue?.aadharCard}`
                    : ""
                }
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
  );
};

export default VehicleDriverForm;
