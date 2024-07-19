import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import moment from "moment";

import {
  Box,
  Button,
  Grid,
  Paper,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
  Modal,
  Backdrop,
  Fade,
  Card,
  Typography,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import {
  postData,
  updateDataById,
  httpActions,
} from "../../../redux/http-slice";
import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import classes from "../styles.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  // border: "2px solid #4977f8",
  boxShadow: 10,
  p: 0,
};

function getAllMonthsBetweenDates(startDateStr, endDateStr) {
  const startDate = moment(startDateStr, "DD-MM-YYYY");
  const endDate = moment(endDateStr, "DD-MM-YYYY");

  const months = [];
  let currentMonth = startDate.clone();

  while (currentMonth.isSameOrBefore(endDate, "month")) {
    const lastDayOfMonth = currentMonth.clone().endOf("month");
    const endDateOfMonth = lastDayOfMonth.isBefore(endDate)
      ? lastDayOfMonth
      : endDate;

    months.push({
      startDate: currentMonth.format("YYYY-MM-DD"),
      endDate: endDateOfMonth.format("YYYY-MM-DD"),
      month: currentMonth.format("MMMM"),
    });

    currentMonth.add(1, "month").startOf("month");
  }

  return months;
}

const ManageTransportForm = ({ editedData }) => {
  const { register, handleSubmit, setValue } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const httpErrorHandler = useHttpErrorHandler();

  const initialState = {
    id: "",
    session: null,
    section: null,
    standard: null,
    startDate: null,
    endDate: null,
    description: "",
  };
  const [editValue, setEditValue] = useState(initialState);

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    vehiclesRoutes: [],
    students: [],
    staff: [],
    stoppage: [],
    transportId: null,
    feeHeads: [],
    transportIdResponse: null,
    studentTransportResponse: [],
  });

  const [open, setOpen] = React.useState(false);
  const [allStandard, setAllStandard] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState([]);
  const [section, setSection] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [session, setSession] = useState(null);
  const [selectedVehicleRoute, setSelectedVehicleRoute] = useState(null);
  const [selectedRouteStoppage, setSelectedRouteStoppage] = useState(null);
  const [transportFee, setTransportFee] = useState(0);
  const [selectedFeeHeads, setSelectedFeeHeads] = useState(null);
  const [transportData, setTransportDate] = useState({
    minDate: "",
    maxDate: "",
  });
  const [date, setDate] = useState({ startDate: null, endDate: null });

  const { response } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    if (editedData) {
      setSession(editedData?.session);
      setEditValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
        startDate: editedData?.startDate,
        endDate: editedData?.endDate,
        description: editedData?.description,
      }));

      setSelectedStandard([
        {
          label: editedData?.student?.standard?.standard,
          value: editedData?.student?.standard?._id,
        },
      ]);

      setSection([
        {
          label: editedData?.section?.section,
          value: editedData?.section?._id,
        },
      ]);

      setSelectedStudent([
        {
          label: `${editedData?.student?.firstName} ${editedData?.student?.middleName} ${editedData?.student?.lastName}`,
          value: `${editedData?.student?._id}_${editedData?.student?.standard?._id}_${editedData?.student?.section?._id}`,
        },
      ]);

      setSelectedVehicleRoute(editedData?.route);
      setSelectedRouteStoppage(editedData?.stoppage);
      setTransportFee(editedData?.transportFee);

      setDate({
        startDate: editedData?.startDate,
        endDate: editedData?.endDate,
      });
      setValue("description", editedData?.description);
    }
  }, [editedData, setValue]);

  useEffect(() => {
    setData((prevState) => ({ ...prevState, section: [] }));

    const sectionData = selectedStandard?.map((stndr) => {
      const matchingItem = allStandard.find((obj) => obj._id === stndr.value);
      return matchingItem ? matchingItem.sections : [];
    });

    const sections = sectionData.flat();
    const uniqueSectionsArray = Array.from(
      new Set(sections.map(JSON.stringify))
    ).map(JSON.parse);

    const allSectionData = uniqueSectionsArray.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));
  }, [selectedStandard, allStandard]);

  // fetch session, feeHead or routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionResp, routsResp, feeHeads] = await Promise.all([
          instance.get("/session/all"),
          instance.get("/routes/all"),
          instance.get("/fee-head/all"),
        ]);

        setData((prevData) => ({
          ...prevData,
          sessions: sessionResp.data.data,
          vehiclesRoutes: routsResp.data.data,
          feeHeads: feeHeads.data.data,
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
    fetchData();
  }, [dispatch]);

  // fetch transportId
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transportId = await instance.get(
          `/transport-id?search=${JSON.stringify({ session: session.name })}`
        );

        const isIdExist = transportId.data.data;

        if (isIdExist.length === 0) {
          setOpen(true);
        } else {
          setData((prevData) => ({
            ...prevData,
            transportId: isIdExist[0],
          }));
        }
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

    if (session) {
      fetchData();
    }
  }, [dispatch, session, data?.transportIdResponse]);

  // fetch standard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          "/standard/all?search=" + JSON.stringify({ session: session?.name })
        );

        const standard = response?.data?.data;
        setAllStandard(standard);
        const allData = standard?.map((item) => ({
          label: item.standard,
          value: item._id,
        }));

        setData((prevData) => ({
          ...prevData,
          standard: allData,
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

    // if (selectedUser?.value === "student") {
    //   setSelectedStandard([]);
    //   setDate((prevSate) => ({ ...prevSate, standard: [] }));
    // }

    if (session) {
      fetchData();
    }
  }, [dispatch, session]);

  // fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardId = selectedStandard?.map((standard) => standard.value);
        const sectionId = section?.map((sec) => sec.value);
        const filterData = {
          standard: standardId,
          section: sectionId,
        };
        const response = await instance.get(
          "/student/allstudent?search=" + JSON.stringify(filterData)
        );

        const students = response.data.data;
        const allData = students?.map((student) => ({
          label: `${student?.firstName} ${student?.middleName} ${student?.lastName}`,
          value: `${student?._id}_${student?.standard?._id}_${student?.section?._id}`,
        }));

        setData((prevData) => ({
          ...prevData,
          students: allData,
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

    if (section?.length > 0 && editValue?.id === "") {
      setSelectedStudent([]);
      fetchData();
    } else if ((!section || !selectedStandard) && editValue?.id === "") {
      setSelectedStudent([]);
      setData((prevState) => ({ ...prevState, students: [] }));
    } else if (section && selectedStandard && editValue?.id !== "") {
      fetchData();
    }
  }, [dispatch, section, selectedStandard, editValue?.id]);
  //   console.log(section);

  // fetch stoppagge
  useEffect(() => {
    const fetchData = async () => {
      try {
        const routeId = selectedVehicleRoute?._id;
        const filterData = {
          route: {
            $in: routeId,
          },
        };
        const response = await instance.get(
          "/stoppage/all?data=" + JSON.stringify(filterData)
        );

        const stoppageData = response.data.data;

        setData((prevData) => ({
          ...prevData,
          stoppage: stoppageData,
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    if (selectedVehicleRoute) {
      fetchData();
    }
  }, [dispatch, selectedVehicleRoute]);

  // setting default session year
  const initialSelectedSession = data?.sessions.find((session) => {
    return session?.active === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      setSession(initialSelectedSession);
    }
  }, [initialSelectedSession]);

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSessionChange = (event, value) => {
    setSession(value);
  };

  // populating existing staff data if already exist in database
  useEffect(() => {
    if (response) {
      const data = response.data;
      if (data?.length > 0 && response.status === "Success") {
        data?.forEach((empData) => {
          toast.info(
            `${empData?.month} - ${empData?.student?.firstName} ${empData?.student?.middleName} ${empData?.student?.lastName}` +
              " already exist!",
            {
              position: "bottom-right",
              closeOnClick: true,
              autoClose: 10000,
              theme: "dark",
            }
          );
        });
      }
      dispatch(httpActions.clearResponse());
    }
  }, [response, dispatch]);

  // creating transpor fee records
  useEffect(() => {
    const studentsTransportData = response?.savedData;

    const postFeeRecords = async () => {
      const feeHeadId = data?.transportId?.transportHeadId?._id;

      const feeRecords = studentsTransportData.map((data) => {
        return {
          session: data?.session,
          student: data?.student,
          standard: data?.standard,
          section: data?.section,
          feeHead: feeHeadId,
          fee: data?.transportFee,
          month: data?.month,
          isAllPaid: false,
          isPreviousBalance: false,
          discountReason: "",
          totalDiscount: 0,
          remainingAmount: data?.transportFee,
          incrementedAmount: 0,
          log: [],
          feeDiscount: [],
        };
      });

      const response = await instance.post(
        "/fee-record/transport",
        feeRecords,
        {
          headers: {
            session: session?.name,
          },
        }
      );

      if (response?.data?.status === "Success") {
        navigate("/student/transport");
      }
    };

    if (studentsTransportData?.length > 0) {
      postFeeRecords();
    }
  }, [navigate, response, session, date, data?.transportId]);

  useEffect(() => {
    if (data?.transportId) {
      setOpen(false);
    }
  }, [data?.transportId]);

  useEffect(() => {
    if (session) {
      const [startYear, endYear] = session?.name.split("-");
      setTransportDate({
        minDate: dayjs(`01-04-${startYear}`, "DD-MM-YYYY"),
        maxDate: dayjs(`31-03-${endYear}`, "DD-MM-YYYY"),
      });
    }
  }, [session]);

  // const onSubmitOld = async () => {
  //   try {
  //     const startDate = date.startDate
  //       ? dayjs(date.startDate).format("YYYY-MM-DD")
  //       : "";
  //     const endDate = date.endDate
  //       ? dayjs(date.endDate).format("YYYY-MM-DD")
  //       : "";

  //     const sessionId = session?._id;
  //     const routeId = selectedVehicleRoute?._id;
  //     const stoppageId = selectedRouteStoppage?._id;
  //     const description = editValue?.description;

  //     const mData = [];
  //     const sectionStandardMap = new Map();

  //     // selectedStandard.forEach((stnd) => {
  //     selectedStudent.forEach((stu) => {
  //       const [studentId, standardId, sectionId] = stu?.value.split("_");

  //       const key = `${standardId}_${sectionId}`; // stnd.valuue

  //       if (!sectionStandardMap.has(key)) {
  //         sectionStandardMap.set(key, {
  //           session: sessionId,
  //           standard: standardId,
  //           section: sectionId,
  //           transportData: [],
  //         });
  //       }

  //       const entry = sectionStandardMap.get(key);

  //       entry.transportData.push({
  //         student: studentId,
  //         route: routeId,
  //         stoppage: stoppageId,
  //         transportFee: transportFee,
  //         endDate: endDate,
  //         startDate: startDate,
  //         description: description,
  //       });
  //     });

  //     // });

  //     mData.push(...sectionStandardMap.values());

  //     if (editValue?.id) {
  //       const id = editValue?.id;
  //       await dispatch(
  //         updateDataById({
  //           path: "/student-transport",
  //           id: id,
  //           data: mData,
  //         })
  //       ).unwrap();
  //     } else {
  //       // const studentTransportResponse = await instance.post(
  //       //   "/student-transport",
  //       //   mData
  //       // );

  //       await dispatch(
  //         postData({ path: "/student-transport", data: mData })
  //       ).unwrap();

  //       // console.log(studentTransportResponse);
  //     }

  //     dispatch(httpActions.clearResponse());
  //   } catch (error) {
  //     httpErrorHandler(error);
  //   }
  // };

  const onSubmit = async () => {
    try {
      const startDate = date.startDate
        ? dayjs(date.startDate).format("DD-MM-YYYY")
        : "";
      const endDate = date.endDate
        ? dayjs(date.endDate).format("DD-MM-YYYY")
        : "";

      const sessionId = session?._id;
      const routeId = selectedVehicleRoute?._id;
      const stoppageId = selectedRouteStoppage?._id;
      const description = editValue?.description;

      const studentTransportFee = [];
      const monthsDate = getAllMonthsBetweenDates(startDate, endDate);

      for (let student of selectedStudent) {
        const [studentId, standardId, sectionId] = student?.value.split("_");

        const feeData = monthsDate.map((month) => {
          return {
            session: sessionId,
            standard: standardId,
            section: sectionId,
            student: studentId,
            route: routeId,
            stoppage: stoppageId,
            transportFee: transportFee,
            startDate: month?.startDate,
            endDate: month?.endDate,
            month: month?.month,
            description: description,
          };
        });

        studentTransportFee.push(...feeData);
      }

      if (editValue?.id) {
        const id = editValue?.id;
        await dispatch(
          updateDataById({
            path: "/student-transport",
            id: id,
            data: {
              studentTransport: studentTransportFee,
              feeHead: data?.transportId?.transportHeadId?._id,
              session: session?.name,
            },
          })
        ).unwrap();

        navigate("/student/transport");
      } else {
        await dispatch(
          postData({ path: "/student-transport", data: studentTransportFee })
        ).unwrap();
      }

      dispatch(httpActions.clearResponse());
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  const handleTransportFeeHeadButtonClick = async () => {
    if (!selectedFeeHeads) {
      toast.error("Please select fee head first", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    const response = await instance.post(
      `/transport-id?search=${JSON.stringify({ session: session.name })}`,
      { transportHeadId: selectedFeeHeads?._id }
    );

    if (response?.data?.status === "Success") {
      toast.success(response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });

      setData((prevData) => ({
        ...prevData,
        transportIdResponse: response?.data?.data,
      }));
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Card sx={style}>
            <CardContent>
              <Grid container spacing={2} wrap="wrap">
                <Grid item md={12} sm={12} xs={12}>
                  <Typography variant="h6" gutterBottom align="center">
                    Please Select Fee Heads For Transport
                  </Typography>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Autocomplete
                    id="highlights-demo"
                    size="small"
                    sx={{ width: "100%" }}
                    style={{ width: "100%" }}
                    options={data?.feeHeads || []}
                    value={selectedFeeHeads || null}
                    getOptionLabel={(options) => options?.name}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    onChange={(event, value) => {
                      setSelectedFeeHeads(value);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Fee Head" />
                    )}
                    renderOption={(props, option, { inputValue }) => {
                      const matches = match(option?.name, inputValue, {
                        insideWords: true,
                      });
                      const parts = parse(option?.name, matches);

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
                <Grid item md={12} sm={12} xs={12} style={{ paddingTop: "0" }}>
                  <Typography
                    variant="caption"
                    display="block"
                    gutterBottom
                    color="error"
                  >
                    Note:- First time only. (not editable)
                  </Typography>
                </Grid>
                <Grid item md={12} sm={12} xs={12} textAlign="center">
                  <Button
                    variant="contained"
                    onClick={handleTransportFeeHeadButtonClick}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Modal>

      <form
        className={classes.container}
        onSubmit={handleSubmit(onSubmit)}
        style={{ minHeight: "80vh" }}
      >
        <Paper style={{ zIndex: 1 }}>
          <CardHeader subheader="Student Transport" title="Manage Transport" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              {/* session select */}
              <Grid item md={3} sm={4} xs={12}>
                <Autocomplete
                  id="highlights-demo"
                  size="small"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.sessions || []}
                  disabled={editValue?.id !== ""}
                  value={session || null}
                  getOptionLabel={(sessions) => sessions?.name}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={handleSessionChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Session" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.name, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.name, matches);

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

              {/* get user select standatd */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 200 }}>
                <MultiSelect
                  options={data?.standard}
                  value={selectedStandard}
                  onChange={(value) => {
                    setSelectedStandard(value);
                    setSection([]);
                  }}
                  labelledBy={"Select Standard"}
                  isCreatable={false}
                  disableSearch={false}
                  disabled={editValue?.id !== ""}
                />
              </Grid>
              {/* select section */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 199 }}>
                <MultiSelect
                  options={data?.section}
                  value={section}
                  onChange={setSection}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                  disabled={editValue?.id !== ""}
                />
              </Grid>
              {/* select student name */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 198 }}>
                <MultiSelect
                  options={data?.students}
                  value={selectedStudent}
                  onChange={(value) => {
                    setSelectedStudent(value);
                  }}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                  disabled={editValue?.id !== ""}
                />
              </Grid>
              {/* select route */}
              <Grid item md={3} sm={4} xs={12}>
                <Autocomplete
                  size="small"
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.vehiclesRoutes || []}
                  value={selectedVehicleRoute || null}
                  getOptionLabel={(option) =>
                    option?.routeCode +
                    ", " +
                    option?.startPlace +
                    ", " +
                    option?.endPlace +
                    ", " +
                    option?.routeDistance +
                    " Km"
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedVehicleRoute(value);
                    setSelectedRouteStoppage(null);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Vehicle Route" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(
                      option?.routeCode +
                        ", " +
                        option?.startPlace +
                        ", " +
                        option?.endPlace +
                        ", " +
                        option?.routeDistance +
                        " Km",
                      inputValue,
                      {
                        insideWords: true,
                      }
                    );
                    const parts = parse(
                      option?.routeCode +
                        ", " +
                        option?.startPlace +
                        ", " +
                        option?.endPlace +
                        ", " +
                        option?.routeDistance +
                        " Km",
                      matches
                    );

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
              {/* select stoppage */}
              <Grid item md={3} sm={4} xs={12}>
                <Autocomplete
                  size="small"
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.stoppage || []}
                  value={selectedRouteStoppage || null}
                  getOptionLabel={(option) => option?.stoppageName}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedRouteStoppage(value);
                    setTransportFee(value?.transportFee);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Route Stoppage" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.stoppageName, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.stoppageName, matches);

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
              {/* Transport fee */}
              <Grid item md={3} sm={4} xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Transport Fee
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    type="number"
                    value={transportFee || 0}
                    onChange={(event) => setTransportFee(event.target.value)}
                    endAdornment={
                      <InputAdornment position="end">/month</InputAdornment>
                    }
                    startAdornment={
                      <InputAdornment position="start">₹</InputAdornment>
                    }
                    label="Transport Fee"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.startDate && (
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
                          value={date.startDate}
                          format="DD/MM/YYYY"
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              startDate: newValue?.format(),
                            }))
                          }
                          shouldDisableDate={(day) =>
                            dayjs(day).isBefore(
                              transportData?.minDate,
                              "day"
                            ) ||
                            dayjs(day).isAfter(transportData?.maxDate, "day")
                          }
                          // defaultValue={dayjs(editValue?.startDate || null)}
                          label="Start Date"
                          className={classes.dateInp}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.startDate && (
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
                          defaultValue={dayjs(date.startDate)}
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              startDate: newValue?.format(),
                            }))
                          }
                          // defaultValue={dayjs(date?.startDate || null)}
                          // defaultValue={date?.startDate}
                          label="Start Date"
                          className={classes.dateInp}
                          shouldDisableDate={(day) =>
                            dayjs(day).isBefore(
                              transportData?.minDate,
                              "day"
                            ) ||
                            dayjs(day).isAfter(transportData?.maxDate, "day")
                          }
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                {!editValue?.endDate && (
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
                          value={date.endDate}
                          onChange={(newValue) =>
                            setDate((prevState) => ({
                              ...prevState,
                              endDate: newValue?.format(),
                            }))
                          }
                          label="End Date"
                          className={classes.dateInp}
                          shouldDisableDate={(day) =>
                            dayjs(day).isBefore(
                              transportData?.minDate,
                              "day"
                            ) ||
                            dayjs(day).isAfter(transportData?.maxDate, "day")
                          }
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {editValue?.endDate && (
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    sx={{ width: "100%" }}
                    className={classes.dateInp}
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
                              endDate: newValue?.format(),
                            }))
                          }
                          defaultValue={dayjs(date?.endDate || null)}
                          label="End Date"
                          className={classes.dateInp}
                          shouldDisableDate={(day) =>
                            dayjs(day).isBefore(
                              transportData?.minDate,
                              "day"
                            ) ||
                            dayjs(day).isAfter(transportData?.maxDate, "day")
                          }
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                )}
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  size="small"
                  className={classes.textField}
                  id="outlined-basic2"
                  label="Description"
                  name="description"
                  variant="outlined"
                  value={editValue?.description || ""}
                  {...register("description")}
                  onChange={handleChange}
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
        </Paper>
      </form>
    </>
  );
};

export default ManageTransportForm;
