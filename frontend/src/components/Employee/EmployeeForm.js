import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Grid,
  Card,
  CardContent,
  InputLabel,
  Button,
  Box,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { postDataWithFile, updateDataWithFile } from "../../redux/http-slice";
import { Upload } from "../Global/FileUpload";
import { PhotoUpload } from "../Global/PhotoUpload";
import axios from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import styles from "./EmployeeForm.module.css";

const salutation = [
  { label: "Mr.", value: "Mr." },
  { label: "Mrs.", value: "Mrs." },
];

const gender = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const maritalStatus = [
  { label: "Married", value: "Married" },
  { label: "Unmarried", value: "Unmarried" },
  { label: "Seperated", value: "Seperated" },
  { label: "Divorced", value: "Divorced" },
  { label: "Other", value: "Other" },
];

const EmployeeForm = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const initialstate = {
    id: "",
    dateOfBirth: "",
    joiningDate: "",
    endOfProbation: "",
    effectiveDate: "",
    photo: "",
    aadharCard: "",
  };

  const [editValue, setEditedValue] = useState(initialstate);

  const [data, setData] = useState({
    city: [],
    state: [],
    locality: [],
    designation: [],
    castCategory: [],
    teachingType: [],
  });

  const [selectedData, setSelectedData] = useState({
    salutation: null,
    gender: null,
    city: null,
    locality: null,
    state: null,
    designation: null,
    castCategory: null,
    teachingType: null,
    maritalStatus: null,
  });

  const [date, setDate] = useState({
    dateOfBirth: null,
    joiningDate: null,
    endOfProbation: null,
    effectiveDate: null,
  });

  const dispatch = useDispatch();

  const photoField = register("photo", { required: false });
  const aadharField = register("aadharCard", { required: false });

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedAadhar, setSelectedAadhar] = useState(null);

  const getData = useCallback(async () => {
    try {
      const [
        cityResponse,
        stateResponse,
        localityResponse,
        designationResponse,
        castCatergoryResponse,
        teachingTypeResponse,
      ] = await Promise.all([
        axios.get(`/city/all`),
        axios.get(`/state/all`),
        axios.get(`/locality/all`),
        axios.get(`/designation/all`),
        axios.get(`/cast-category/all`),
        axios.get(`/teaching-type/all`),
      ]);

      setData((prevState) => ({
        ...prevState,
        city: cityResponse?.data?.data,
        state: stateResponse?.data?.data,
        locality: localityResponse?.data?.data,
        designation: designationResponse?.data?.data,
        castCategory: castCatergoryResponse?.data?.data,
        teachingType: teachingTypeResponse?.data?.data,
      }));
    } catch (error) {
      if (
        error?.response?.data?.status === 401 ||
        error?.response?.data?.status === 500
      ) {
        toast.error("Please login again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        dispatch(authActions.logout());
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (editedData) {
      setValue("employeeNo", editedData?.employeeNo);
      setValue("firstName", editedData?.firstName);
      setValue("middleName", editedData?.middleName);
      setValue("lastName", editedData?.lastName);
      setValue("email", editedData?.email);
      setValue("mobileNo", editedData?.mobileNo);
      setValue("mobileNo", editedData?.mobileNo);
      setValue("aadharNo", editedData?.aadharNo);
      setValue("qualification", editedData?.qualification);
      setValue("religion", editedData?.religion);
      setValue("bloodGroup", editedData?.bloodGroup);
      setValue("fatherName", editedData?.fatherName);
      setValue("motherName", editedData?.motherName);
      setValue("husband_wife_name", editedData?.husband_wife_name);
      setValue("permanentAdd", editedData?.permanentAdd);
      setValue("correspondenceAdd", editedData?.correspondenceAdd);
      setValue("postOffice", editedData?.postOffice);
      setValue("district", editedData?.district);
      setValue("pinCode", editedData?.pinCode);
      setValue("nationality", editedData?.nationality);
      setValue("password", editedData?.password);
      setValue("position", editedData?.position);
      setValue("department", editedData?.department);
      setValue("jobType", editedData?.jobType);

      setEditedValue((prevData) => ({
        ...prevData,
        id: editedData?._id,
        dateOfBirth: editedData?.dateOfBirth,
        joiningDate: editedData?.joiningDate,
        endOfProbation: editedData?.endOfProbation,
        effectiveDate: editedData?.effectiveDate,
        photo: editedData?.photo,
        aadharCard: editedData?.aadharCard,
      }));
      // console.log(editedData);

      setDate((prevData) => ({
        ...prevData,
        dateOfBirth: editedData?.dateOfBirth,
        joiningDate: editedData?.joiningDate,
        endOfProbation: editedData?.endOfProbation,
        effectiveDate: editedData?.effectiveDate,
      }));

      setSelectedData((prevData) => ({
        ...prevData,
        salutation: {
          label: editedData?.salutation,
          value: editedData?.salutation,
        },
        gender: { label: editedData?.gender, value: editedData?.gender },
        maritalStatus: {
          label: editedData?.maritalStatus,
          value: editedData?.maritalStatus,
        },
        city: editedData?.city,
        locality: editedData?.locality,
        state: editedData?.state,
        designation: editedData?.designation,
        castCategory: editedData?.castCategory,
        teachingType: editedData?.teachingType,
      }));
    }
  }, [editedData, setValue]);

  const onSubmit = async (data) => {
    try {
      const { dateOfBirth, joiningDate, endOfProbation, effectiveDate } = date;
      const dob = dateOfBirth ? dayjs(dateOfBirth).format("YYYY-MM-DD") : "";

      const joining = joiningDate
        ? dayjs(joiningDate).format("YYYY-MM-DD")
        : "";

      const eop = joiningDate ? dayjs(endOfProbation).format("YYYY-MM-DD") : "";

      const ed = joiningDate ? dayjs(effectiveDate).format("YYYY-MM-DD") : "";

      const postData = {
        ...data,
        dateOfBirth: dob,
        joiningDate: joining,
        endOfProbation: eop,
        effectiveDate: ed,
        salutation: selectedData?.salutation?.value,
        gender: selectedData?.gender?.value,
        city: selectedData?.city?._id,
        locality: selectedData?.locality?._id,
        state: selectedData?.state?._id,
        castCategory: selectedData?.castCategory?._id,
        teachingType: selectedData?.teachingType?._id,
        maritalStatus: selectedData?.maritalStatus?.value,
        designation: selectedData?.designation?._id,
      };

      const formData = new FormData();
      formData.append("photo", selectedPhoto);
      formData.append("aadharCard", selectedAadhar);
      formData.append("data", JSON.stringify(postData));

      if (editValue?.id === "") {
        await dispatch(
          postDataWithFile({ path: "/employee", data: formData })
        ).unwrap();
      } else if (editValue?.id !== "") {
        const id = editValue?.id;
        await dispatch(
          updateDataWithFile({
            path: "/employee",
            id: id,
            data: formData,
          })
        ).unwrap();
      }
      navigate("/employee-list");
    } catch (error) {
      toast.success(error?.message || "Something went wrong!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className={styles["main-container"]}
    >
      <Card>
        <CardHeader color="primary" title="EMPLOYEE PERSIONAL INFORMATION" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.employeeNo ? true : false}
                size="small"
                id="employeeNo"
                label="Employee No"
                variant="outlined"
                name="employeeNo"
                helperText={errors.employeeNo ? "Field is required!" : ""}
                {...register("employeeNo", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.designation || []}
                value={selectedData?.designation || null}
                getOptionLabel={(option) => option?.title}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    designation: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Designation" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={salutation}
                value={selectedData?.salutation}
                getOptionLabel={(option) => option?.label}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    salutation: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Salutation" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.firstName ? true : false}
                size="small"
                id="firstName"
                label="First Name"
                variant="outlined"
                name="firstName"
                helperText={errors.firstName ? "Field is required!" : ""}
                {...register("firstName", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                size="small"
                id="middleName"
                label="Middle Name"
                variant="outlined"
                name="middleName"
                {...register("middleName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.lastName ? true : false}
                size="small"
                id="outlined-basic3"
                label="Last Name"
                variant="outlined"
                name="lastName"
                helperText={errors.lastName ? "Field is required!" : ""}
                {...register("lastName", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth error={errors.gender ? true : false}>
                <Autocomplete
                  size="small"
                  id="tags-outlined6"
                  options={gender || []}
                  value={selectedData?.gender || null}
                  getOptionLabel={(option) => option?.label}
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      gender: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender"
                      error={errors.gender ? true : false}
                    />
                  )}
                />
                {errors.gender && (
                  <FormHelperText>
                    {errors.gender.message || "Field is required!"}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined6"
                options={data?.castCategory || []}
                value={selectedData?.castCategory || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    castCategory: value,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Cast" />}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.email ? true : false}
                size="small"
                id="outlined-basic6"
                label="Email Id"
                type="email"
                variant="outlined"
                name="email"
                helperText={errors.email ? "Field is required!" : ""}
                {...register("email")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.mobileNo ? true : false}
                size="small"
                id="outlined-basic4"
                label="Mobile Number"
                type="number"
                variant="outlined"
                name="mobileNo"
                helperText={errors.mobileNo ? "Field is required!" : ""}
                {...register("mobileNo", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.dateOfBirth && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            dateOfBirth: newValue.format(),
                          }))
                        }
                        label="Date Of Birth"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.dateOfBirth && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            dateOfBirth: newValue.format(),
                          }))
                        }
                        label="Date Of Birth"
                        defaultValue={dayjs(date?.dateOfBirth || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.aadharNo ? true : false}
                size="small"
                id="aadharNo"
                type="number"
                label="Aadhar Number"
                variant="outlined"
                name="aadharNo"
                helperText={errors.aadharNo ? "Field is required!" : ""}
                {...register("aadharNo", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.qualification ? true : false}
                size="small"
                id="qualification"
                label="Qualification"
                variant="outlined"
                name="qualification"
                helperText={errors.qualification ? "Field is required!" : ""}
                {...register("qualification", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth error={errors.teachingType ? true : false}>
                <Autocomplete
                  size="small"
                  id="tags-outlined6"
                  options={data?.teachingType || []}
                  value={selectedData?.teachingType || null}
                  getOptionLabel={(option) => option?.type}
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      teachingType: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Teacing Type"
                      error={errors.teachingType ? true : false}
                    />
                  )}
                />
                {errors.teachingType && (
                  <FormHelperText>
                    {errors.teachingType.message || "Field is required!"}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl
                fullWidth
                error={errors.maritalStatus ? true : false}
              >
                <Autocomplete
                  size="small"
                  id="tags-outlined6"
                  options={maritalStatus || []}
                  value={selectedData?.maritalStatus || null}
                  getOptionLabel={(option) => option?.label}
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      maritalStatus: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Marital Status"
                      error={errors.maritalStatus ? true : false}
                    />
                  )}
                />
                {errors.maritalStatus && (
                  <FormHelperText>
                    {errors.maritalStatus.message || "Field is required!"}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.religion ? true : false}
                size="small"
                id="outlined-basic2"
                label="Religion"
                variant="outlined"
                name="religion"
                helperText={errors.religion ? "Field is required!" : ""}
                {...register("religion", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.bloodGroup ? true : false}
                size="small"
                id="bloodGroup"
                label="Blood Group"
                variant="outlined"
                name="bloodGroup"
                helperText={errors.bloodGroup ? "Field is required!" : ""}
                {...register("bloodGroup", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.fatherName ? true : false}
                size="small"
                id="fatherName"
                label="Father Name"
                variant="outlined"
                name="fatherName"
                helperText={errors.fatherName ? "Field is required!" : ""}
                {...register("fatherName", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.motherName ? true : false}
                size="small"
                id="motherName"
                label="Mother Name"
                variant="outlined"
                name="motherName"
                helperText={errors.motherName ? "Field is required!" : ""}
                {...register("motherName", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.husband_wife_name ? true : false}
                size="small"
                id="husband_wife_name"
                label="Husband/wife Name"
                variant="outlined"
                name="husband_wife_name"
                helperText={
                  errors.husband_wife_name ? "Field is required!" : ""
                }
                {...register("husband_wife_name")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="ADDRESS" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.correspondenceAdd ? true : false}
                size="small"
                id="outlined-basic78"
                label="Correspondence Address"
                variant="outlined"
                name="correspondenceAdd"
                helperText={
                  errors.correspondenceAdd ? "Field is required!" : ""
                }
                {...register("correspondenceAdd", { required: true })}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.permanentAdd ? true : false}
                size="small"
                id="permanentAdd"
                label="Prmanent Address"
                variant="outlined"
                name="permanentAdd"
                helperText={errors.permanentAdd ? "Field is required!" : ""}
                {...register("permanentAdd", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.postOffice ? true : false}
                size="small"
                id="outlined-basic"
                label="Post Office"
                variant="outlined"
                name="postOffice"
                helperText={errors.postOffice ? "Field is required!" : ""}
                {...register("postOffice", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.district ? true : false}
                size="small"
                id="outlined-basic"
                label="District"
                variant="outlined"
                name="district"
                helperText={errors.distric ? "Field is required!" : ""}
                {...register("district", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.city || []}
                value={selectedData?.city || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    city: value,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="City" />}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.locality || []}
                value={selectedData?.locality || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    locality: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Locality" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.state || []}
                value={selectedData?.state || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    state: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="State" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.pinCode ? true : false}
                size="small"
                id="outlined-basic13"
                label="Pin Code"
                variant="outlined"
                type="number"
                name="pinCode"
                helperText={errors.pinCode ? "Field is required!" : ""}
                {...register("pinCode", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.nationality ? true : false}
                size="small"
                id="outlined-basic21"
                label="Nationality"
                defaultValue="Indian"
                variant="outlined"
                name="nationality"
                helperText={errors.nationality ? "Field is required!" : ""}
                {...register("nationality", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.password ? true : false}
                size="small"
                id="outlined-basic22"
                label="Password"
                variant="outlined"
                name="password"
                helperText={errors.password ? "Field is required!" : ""}
                {...register("password", { required: true })}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="JOB DETAILS" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.joiningDate && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem>
                      <DatePicker
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            joiningDate: newValue.format(),
                          }))
                        }
                        label="Joining date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.joiningDate && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            joiningDate: newValue.format(),
                          }))
                        }
                        label="Joining date"
                        defaultValue={dayjs(date?.joiningDate || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.endOfProbation && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            endOfProbation: newValue.format(),
                          }))
                        }
                        label="End Of Probation"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.endOfProbation && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            endOfProbation: newValue.format(),
                          }))
                        }
                        label="End Of Probation"
                        defaultValue={dayjs(date?.endOfProbation || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.effectiveDate && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            effectiveDate: newValue.format(),
                          }))
                        }
                        label="Effective Date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.effectiveDate && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%", mt: -0.9 }}
                  >
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            effectiveDate: newValue.format(),
                          }))
                        }
                        label="Effective Date"
                        defaultValue={dayjs(date?.effectiveDate || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.position ? true : false}
                size="small"
                id="position"
                label="Position"
                variant="outlined"
                name="position"
                helperText={errors.position ? "Field is required!" : ""}
                {...register("position", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.department ? true : false}
                size="small"
                id="department"
                label="Department"
                variant="outlined"
                name="department"
                helperText={errors.department ? "Field is required!" : ""}
                {...register("department", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.jobType ? true : false}
                size="small"
                id="jobType"
                label="Job Type"
                variant="outlined"
                name="jobType"
                helperText={errors.jobType ? "Field is required!" : ""}
                {...register("jobType", { required: true })}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Photo</InputLabel>
              <PhotoUpload
                onDrop={(file) => {
                  setSelectedPhoto(file[0]);
                }}
                handleFileChange={(e) => {
                  photoField.onChange(e);
                }}
                fileAccept=".jpg, .jpeg, .png"
                inpId="photo"
                name="photo"
                existingFile={
                  editValue?.photo ? `Staff/photo/${editValue?.photo}` : ""
                }
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Aadhar Card</InputLabel>
              <Upload
                onDrop={(file) => {
                  setSelectedAadhar(file[0]);
                }}
                handleFileChange={(e) => {
                  aadharField.onChange(e);
                }}
                fileAccept=".pdf, .jpg, .jpeg, .png"
                inpId="aadhar"
                name="aadharCard"
                existingFile={
                  editValue.aadharCard
                    ? `Staff/aadhar/${editValue?.aadharCard}`
                    : ""
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box className={styles["submit-button"]}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default EmployeeForm;
