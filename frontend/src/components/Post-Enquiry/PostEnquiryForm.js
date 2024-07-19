import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import instance from "../../util/axios/config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { authActions } from "../../redux/auth-slice";
import { fetchData } from "../../redux/http-slice";
import styles from "./styles.module.css";
import {
  getCity,
  getState,
  getLocality,
  getSession,
  getCourseTyppe,
  getCastCategory,
} from "../../util/student-apis/student-apis";

const salutation = [
  { label: "Mr.", value: "Mr." },
  { label: "Mrs.", value: "Mrs." },
];

const gender = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const PostEnquiryForm = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const enqPurposeData = useSelector((state) => state.httpRequest);

  const initialstate = {
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    totalMarks: "",
    obtainedMarks: "",
    percentageCGPA: "",
    dateOfBirth: "",
    passingYear: "",
  };

  const [editValue, setEditedValue] = useState(initialstate);
  const [data, setData] = useState({
    sessions: [],
    city: [],
    locality: [],
    state: [],
    standard: [],
    section: [],
    courseType: [],
    enqPurpose: [],
    castCategory: [],
  });
  const [date, setDate] = useState({
    dateOfBirth: null,
    passingYear: null,
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    salutation: null,
    gender: null,
    cast: null,
    city: null,
    locality: null,
    state: null,
    standard: null,
    section: null,
    courseType: null,
    enqPurpose: null,
  });

  // setting default session year
  const initialSelectedSession = data?.sessions.find((session) => {
    return session?.active === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      setSelectedData((prevState) => ({
        ...prevState,
        session: initialSelectedSession,
      }));
    }
  }, [initialSelectedSession]);

  const sortData = (arr) => {
    return arr?.sort((a, b) => a.name.localeCompare(b.name));
  };

  const getData = useCallback(async () => {
    const cityData = await getCity();
    const localityData = await getLocality();
    const stateData = await getState();
    const sessionData = await getSession();
    const courseTypeData = await getCourseTyppe();
    const castCategory = await getCastCategory();

    setData((prevState) => ({
      ...prevState,
      sessions: sessionData,
      city: sortData(cityData),
      locality: sortData(localityData),
      state: sortData(stateData),
      courseType: courseTypeData,
      castCategory: castCategory,
    }));
  }, []);

  useEffect(() => {
    if (editedData) {
      setValue("firstName", editedData?.firstName);
      setValue("middleName", editedData?.middleName);
      setValue("lastName", editedData?.lastName);
      setValue("stuMobileNo", editedData?.stuMobileNo);
      setValue("email", editedData?.email);
      setValue("fatherName", editedData?.fatherName);
      setValue("motherName", editedData?.motherName);
      setValue("fatherOccupation", editedData?.fatherOccupation);
      setValue("parentMobileNo", editedData?.parentMobileNo);
      setValue("whatsappMobileNo", editedData?.whatsappMobileNo);
      setValue("relation", editedData?.relation);
      setValue("correspondenceAdd", editedData?.correspondenceAdd);
      setValue("permanentAdd", editedData?.permanentAdd);
      setValue("postOffice", editedData?.postOffice);
      setValue("district", editedData?.district);
      setValue("pinCode", editedData?.pinCode);
      setValue("nationality", editedData?.nationality);
      setValue("schoolName", editedData?.schoolName);
      setValue("board", editedData?.board);
      setValue("previousStandard", editedData?.previousStandard);

      setDate((prevState) => ({
        ...prevState,
        dateOfBirth: editedData?.dateOfBirth,
        passingYear: editedData?.passingYear,
      }));

      setEditedValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
        totalMarks: editedData?.totalMarks,
        obtainedMarks: editedData?.obtainedMarks,
        percentageCGPA: editedData?.percentageCGPA,
        passingYear: editedData?.passingYear,
        dateOfBirth: editedData?.dateOfBirth,
      }));

      const seletedGender = gender.find((item) => {
        return item?.value === editedData?.gender;
      });

      // const seletedCast = cast.find((item) => {
      //   return item?.value === editedData?.cast;
      // });

      const selectedSalutation = salutation.find((item) => {
        return item?.value === editedData?.salutation;
      });

      setSelectedData({
        session: editedData?.session,
        standard: editedData?.standard,
        section: editedData?.section,
        enqPurpose: editedData?.enquiryPurpose,
        courseType: editedData?.courseType,
        city: editedData?.city,
        locality: editedData?.locality,
        state: editedData?.state,
        salutation: selectedSalutation,
        gender: seletedGender,
        cast: editedData?.castCategory,
      });
    }
  }, [editedData, setValue]);

  // fetch standard
  useEffect(() => {
    const fetchStandard = async () => {
      try {
        const standardResp = await instance.get(
          `/standard/all?search=${JSON.stringify({
            session: selectedData?.session?.name,
          })}`
        );

        const data = standardResp?.data?.data;
        setData((prevState) => ({
          ...prevState,
          standard: data,
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
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (selectedData?.session) {
      fetchStandard();
    }
  }, [dispatch, selectedData?.session]);

  useEffect(() => {
    if (!enqPurposeData?.Loading && enqPurposeData?.data) {
      setData((prevState) => ({
        ...prevState,
        enqPurpose: enqPurposeData?.data,
      }));
    }
  }, [enqPurposeData]);

  const getEnquiryPurpose = useCallback(async () => {
    try {
      await dispatch(fetchData({ path: "/enquiry-purpose/all" })).unwrap();
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
  }, [dispatch]);

  useEffect(() => {
    getEnquiryPurpose();
    getData();
  }, [getEnquiryPurpose, getData]);

  useEffect(() => {
    if (selectedData?.standard) {
      setData((prevState) => ({
        ...prevState,
        section: selectedData?.standard?.sections,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        section: [],
      }));
    }
  }, [selectedData?.standard]);

  const postData = async (data) => {
    try {
      const admissionDate = date?.admissionDate
        ? dayjs(date.admissionDate).format("YYYY-MM-DD")
        : "";

      const dateOfBirth = date?.dateOfBirth
        ? dayjs(date.dateOfBirth).format("YYYY-MM-DD")
        : "";

      const passingYear = date?.passingYear
        ? dayjs(date.passingYear).format("YYYY-MM-DD")
        : "";

      const formData = {
        ...data,
        admissionDate,
        dateOfBirth,
        passingYear,
        enquiryPurpose: selectedData?.enqPurpose?._id,
        totalMarks: editValue?.totalMarks,
        obtainedMarks: editValue?.obtainedMarks,
        percentageCGPA: editValue?.percentageCGPA,
        salutation: selectedData?.salutation?.value,
        gender: selectedData?.gender?.value,
        castCategory: selectedData?.cast?._id,
        session: selectedData?.session?._id,
        city: selectedData?.city?._id,
        locality: selectedData?.locality?._id,
        state: selectedData?.state?._id,
        standard: selectedData?.standard?._id,
        section: selectedData?.section?._id,
        courseType: selectedData?.courseType?._id,
      };

      if (
        editValue?.obtainedMarks > editValue?.totalMarks ||
        editValue?.percentageCGPA > 100 ||
        !selectedData?.enqPurpose
      ) {
        return;
      }

      let response = "";

      if (editValue?.id !== "") {
        response = await instance.put(
          "/post-enquiry/" + editValue?.id,
          formData
        );
      } else {
        response = await instance.post("/post-enquiry", formData);
      }

      if (response?.data?.status === "Success") {
        toast.success(response?.data?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
      navigate("/enquiry/post-enquiry");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const onSubmit = (data) => {
    postData(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className={styles["container"]}
    >
      <Typography variant="h5" className={styles.heading} gutterBottom>
        Post Enquiry Form
      </Typography>
      <Card sx={{ mt: 2 }}>
        <CardHeader color="primary" title="Student Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.sessions || []}
                value={selectedData?.session || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    session: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Session" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.enqPurpose || []}
                value={selectedData?.enqPurpose || null}
                getOptionLabel={(option) => option?.purpose}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    enqPurpose: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Enquiry Purpose" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={salutation || []}
                value={selectedData?.salutation || null}
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
                {...register("firstName")}
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
                id="lastName"
                label="lastName"
                variant="outlined"
                name="lastName"
                helperText={errors.lastName ? "Field is required!" : ""}
                {...register("lastName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.stuMobileNo ? true : false}
                size="small"
                id="stuMobileNo"
                label="Mobile Number"
                type="number"
                variant="outlined"
                name="stuMobileNo"
                helperText={errors.stuMobileNo ? "Field is required!" : ""}
                {...register("stuMobileNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.email ? true : false}
                size="small"
                id="email"
                label="Email Id"
                type="email"
                variant="outlined"
                name="email"
                helperText={errors.email ? "Field is required!" : ""}
                {...register("email")}
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
                      {...register("gender")}
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
                value={selectedData?.cast || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    cast: value,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Cast" />}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.dateOfBirth && (
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
                        defaultValue={dayjs(date?.dateOfBirth || null)}
                        label="Date Of Birth"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="Parents Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
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
                {...register("fatherName")}
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
                helperText={errors.fatherName ? "Field is required!" : ""}
                {...register("motherName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.fatherOccupation ? true : false}
                size="small"
                id="fatherOccupation"
                label="Father Occupation"
                variant="outlined"
                name="fatherOccupation"
                helperText={errors.fatherOccupation ? "Field is required!" : ""}
                {...register("fatherOccupation")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.parentMobileNo ? true : false}
                size="small"
                id="parentMobileNo"
                label="Mobile Number"
                type="number"
                variant="outlined"
                name="parentMobileNo"
                helperText={errors.parentMobileNo ? "Field is required!" : ""}
                {...register("parentMobileNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.whatsappMobileNo ? true : false}
                size="small"
                id="whatsappMobileNo"
                label="WhatsApp No"
                type="number"
                variant="outlined"
                name="whatsAppMobileNo"
                helperText={errors.whatsappMobileNo ? "Field is required!" : ""}
                {...register("whatsappMobileNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.relation ? true : false}
                size="small"
                id="relation"
                label="Relation"
                variant="outlined"
                name="relation"
                helperText={errors.relation ? "Field is required!" : ""}
                {...register("relation")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="Address" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.correspondenceAdd ? true : false}
                size="small"
                id="correspondenceAdd"
                label="Correspondence Address"
                variant="outlined"
                name="correspondenceAdd"
                helperText={
                  errors.correspondenceAdd ? "Field is required!" : ""
                }
                {...register("correspondenceAdd")}
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
                {...register("permanentAdd")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.postOffice ? true : false}
                size="small"
                id="postOffice"
                label="Post Office"
                variant="outlined"
                name="postOffice"
                helperText={errors.postOffice ? "Field is required!" : ""}
                {...register("postOffice")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.district ? true : false}
                size="small"
                id="district"
                label="District"
                variant="outlined"
                name="district"
                helperText={errors.distric ? "Field is required!" : ""}
                {...register("district")}
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
                id="pinCode"
                label="Pin Code"
                variant="outlined"
                type="number"
                name="pinCode"
                helperText={errors.pinCode ? "Field is required!" : ""}
                {...register("pinCode")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.nationality ? true : false}
                size="small"
                id="nationality"
                label="Nationality"
                defaultValue="Indian"
                variant="outlined"
                name="nationality"
                helperText={errors.nationality ? "Field is required!" : ""}
                {...register("nationality")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="Previous Academic Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.schoolName ? true : false}
                size="small"
                id="schoolName"
                label="School Name"
                variant="outlined"
                name="schoolName"
                helperText={errors.schoolName ? "Field is required!" : ""}
                {...register("schoolName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.board ? true : false}
                size="small"
                id="board"
                label="Board"
                variant="outlined"
                name="board"
                helperText={errors.board ? "Field is required!" : ""}
                {...register("board")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.previousStandard ? true : false}
                size="small"
                id="previousStandard"
                label="Standard"
                variant="outlined"
                name="previousStandard"
                helperText={errors.previousStandard ? "Field is required!" : ""}
                {...register("previousStandard")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.passingYear && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                  name="passingYear"
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
                            passingYear: newValue.format(),
                          }))
                        }
                        label="Passing Year"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.passingYear && (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  fullWidth
                  size="small"
                  locale="en"
                  timeZone="Asia/Kolkata"
                  name="passingYear"
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
                            passingYear: newValue.format(),
                          }))
                        }
                        label="Passing Year"
                        defaultValue={dayjs(date?.passingYear || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.totalMarks ? true : false}
                size="small"
                id="totalMarks"
                label="Total Marks"
                type="number"
                variant="outlined"
                value={editValue?.totalMarks || ""}
                onChange={(event) => {
                  setEditedValue((prevState) => ({
                    ...prevState,
                    totalMarks: event?.target?.value,
                  }));
                }}
                name="totalMarks"
                helperText={errors.totalMarks ? "Field is required!" : ""}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={
                  Number(editValue?.totalMarks) <
                  Number(editValue?.obtainedMarks)
                    ? true
                    : false
                }
                size="small"
                id="obtainedMarks"
                label="Total Obtained Marks"
                type="number"
                variant="outlined"
                name="obtainedMarks"
                value={editValue?.obtainedMarks || ""}
                onChange={(event) => {
                  setEditedValue((prevState) => ({
                    ...prevState,
                    obtainedMarks: event?.target?.value,
                  }));
                }}
                helperText={
                  Number(editValue?.totalMarks) <
                  Number(editValue?.obtainedMarks)
                    ? "Please Enter Valid Marks!"
                    : ""
                }
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={Number(editValue?.percentageCGPA) > 100 ? true : false}
                size="small"
                id="percentageCGPA"
                label="Percentage/CGPA"
                type="number"
                variant="outlined"
                name="percentageCGPA"
                value={editValue?.percentageCGPA}
                onChange={(event) => {
                  setEditedValue((prevState) => ({
                    ...prevState,
                    percentageCGPA: event?.target?.value,
                  }));
                }}
                helperText={
                  Number(editValue?.percentageCGPA) > 100
                    ? "Please enter valid result!"
                    : ""
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader title="Current Academic Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.standard || []}
                value={selectedData?.standard || null}
                getOptionLabel={(option) => option?.standard}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                  }));
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Standard" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.section || []}
                value={selectedData?.section || null}
                getOptionLabel={(option) => option?.section}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Section" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.courseType || []}
                value={selectedData?.courseType || null}
                getOptionLabel={(option) => option?.courseType}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    courseType: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Course Type" />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box className={styles["submit-button"]}>
        <Button color="primary" type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default PostEnquiryForm;
