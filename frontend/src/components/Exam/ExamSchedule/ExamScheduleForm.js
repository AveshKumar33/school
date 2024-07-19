import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

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
  InputLabel,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import {
  postData,
  updateDataById,
  httpActions,
} from "../../../redux/http-slice";
import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import classes from "../styles.module.css";

const ExamScheduleForm = ({ editedData }) => {
  const { handleSubmit, setValue } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const httpErrorHandler = useHttpErrorHandler();

  // const { response } = useSelector((state) => state.httpRequest);

  const initialState = {
    id: "",
    session: null,
    section: [],
    paper: null,
    standard: null,
  };
  const [editValue, setEditValue] = useState(initialState);

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    teachers: [],
    paper: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: null,
    paper: null,
    teacher: null,
  });

  const [date, setDate] = useState({
    scheduleDate: null,
    startTime: null,
    endTime: null,
  });

  // session field update left change after student admission input update
  useEffect(() => {
    if (editedData) {
      setSelectedData((prevState) => ({
        ...prevState,
        session: editedData?.session,
        standard: editedData?.standard,
        section: [
          {
            label: editedData?.section?.section,
            value: editedData?.section?._id,
          },
        ],
        paper: editedData?.paper,
        teacher: editedData?.teacher,
      }));

      setEditValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
      }));

      setDate((prevState) => ({
        ...prevState,
        scheduleDate: editedData?.scheduleDate,
        startTime: editedData?.startTime,
        endTime: editedData?.endTime,
      }));
    }
  }, [editedData, setValue]);

  useEffect(() => {
    const sectionData = selectedData?.standard?.sections;

    const allSectionData = sectionData?.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));
  }, [selectedData?.standard]);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  useEffect(() => {
    // setData((prevSate) => ({ ...prevSate, paper: [] }));
    const getPaper = async (searchQuery) => {
      try {
        const paperResp = await instance.get(
          `/paper-map/all?search=${JSON.stringify(searchQuery)}`
        );
        setData((prevData) => ({
          ...prevData,
          paper: paperResp.data.data,
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
    if (selectedData?.section?.length > 0 && selectedData?.standard) {
      const searchData = {
        standard: selectedData?.standard?._id,
        sections: getId(selectedData?.section),
      };
      getPaper(searchData);
    }
  }, [selectedData?.section, selectedData?.standard]);

  // fetch session
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        setData((prevData) => ({
          ...prevData,
          sessions: sessionResp?.data?.data,
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
          toast.error(
            error?.response?.data?.message || "Something went wrong",
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };
    fetchData();
  }, [dispatch]);

  // fetch exam, teacher and standard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchQuery = {
          title: "Teacher",
        };

        const [teacherResp, standardResp] = await Promise.all([
          instance.get(`./employee/all?data=${JSON.stringify(searchQuery)}`),
          instance.get(
            "/standard/all?search=" +
              JSON.stringify({ session: selectedData?.session?.name })
          ),
        ]);

        setData((prevData) => ({
          ...prevData,
          standard: standardResp?.data?.data,
          teachers: teacherResp?.data?.data,
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
          toast.error(
            error?.response?.data?.message || "Something went wrong",
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };

    if (selectedData?.session) {
      fetchData();
    }
  }, [dispatch, selectedData?.session]);

  // setting default session year
  const initialSelectedSession = data?.sessions.find((session) => {
    return session?.active === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      if (editValue?.id === "") {
        setSelectedData((prevState) => ({
          ...prevState,
          session: initialSelectedSession,
        }));
      }
    }
  }, [initialSelectedSession, editValue?.id]);

  const onSubmit = async () => {
    try {
      if (date?.scheduleDate && date?.endTime && date?.startTime) {
        const sessionId = selectedData?.session?._id;
        const standardId = selectedData?.standard?._id;
        const paperId = selectedData?.paper?._id;
        const teacher = selectedData?.teacher?._id;

        const scheduleDate = date?.scheduleDate
          ? dayjs(date?.scheduleDate).format("YYYY-MM-DD")
          : "";

        if (editValue?.id !== "") {
          const id = editValue?.id;

          const updatedData = {
            // session: sessionId,
            teacher: teacher,
            // standard: standardId,
            // section: selectedData?.section?.value,
            paper: paperId,
            scheduleDate: scheduleDate,
            startTime: date?.startTime,
            endTime: date?.endTime,
          };

          await dispatch(
            updateDataById({
              path: "/exam-schedule",
              id: id,
              data: updatedData,
            })
          ).unwrap();
        } else {
          const formData = selectedData?.section.map((section) => ({
            session: sessionId,
            teacher: teacher,
            standard: standardId,
            section: section?.value,
            paper: paperId,
            scheduleDate: scheduleDate,
            startTime: date?.startTime,
            endTime: date?.endTime,
          }));

          await dispatch(
            postData({ path: "/exam-schedule", data: formData })
          ).unwrap();
        }
        dispatch(httpActions.clearResponse());
        setEditValue(initialState);
        navigate("/exam/exam-schedule");
      } else {
        toast.error("All fileds are required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(onSubmit)}
      style={{ minHeight: "80vh", paddingTop: "30px" }}
    >
      <Paper style={{ zIndex: 1 }}>
        <CardHeader title="Exam Schedule" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            {/* session select */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Session</InputLabel>
              <Autocomplete
                id="highlights-demo"
                required
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.sessions || []}
                value={selectedData?.session || null}
                disabled={editValue?.id !== ""}
                getOptionLabel={(sessions) => sessions?.name}
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
                  <TextField
                    {...params}
                    placeholder="Session"
                    required={true}
                  />
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

            {/* select standatd */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Standard</InputLabel>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.standard || []}
                value={selectedData?.standard || null}
                disabled={editValue.id !== ""}
                getOptionLabel={(options) => options?.standard}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                  }));
                  setSelectedData((prevSate) => ({
                    ...prevSate,
                    paper: null,
                    section: [],
                  }));
                  setData((prevSate) => ({
                    ...prevSate,
                    paper: [],
                    section: [],
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Standard"
                    // required={true}
                  />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.standard, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.standard, matches);

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

            {/* select section */}
            <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
              <InputLabel>Section</InputLabel>
              <MultiSelect
                options={data?.section || []}
                value={selectedData?.section || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                    paper: null,
                  }));

                  setEditValue((prevState) => ({
                    ...prevState,
                    selectedPaper: null,
                  }));
                  setData((prevSate) => ({ ...prevSate, paper: [] }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
                disabled={editValue?.id !== ""}
              />
            </Grid>

            {/* select paper  */}
            <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
              <InputLabel>Paper</InputLabel>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                options={data?.paper || []}
                value={selectedData.paper || null}
                getOptionLabel={(option) =>
                  `${option?.examName?.examName}, ${
                    option?.examType?.examType
                  }, ${option?.paper?.paper}, ${option?.examType?.examType}, ${
                    option?.maxMarks || option?.minMarks
                      ? `Marks(${
                          option?.maxMarks + ", " + option?.minMarks || ""
                        }),`
                      : ""
                  }${
                    option?.weightage
                      ? " weightage (" + option?.weightage + ")"
                      : ""
                  }`
                }
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    paper: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Paper" required={true} />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(
                    `${option?.examName?.examName}, ${
                      option?.examType?.examType
                    }, ${option?.paper?.paper}, ${
                      option?.examType?.examType
                    }, ${
                      option?.maxMarks || option?.minMarks
                        ? `Marks(${
                            option?.maxMarks + ", " + option?.minMarks || ""
                          }),`
                        : ""
                    }${
                      option?.weightage
                        ? " weightage (" + option?.weightage + ")"
                        : ""
                    }`,
                    inputValue,
                    {
                      insideWords: true,
                    }
                  );
                  const parts = parse(
                    `${option?.examName?.examName}, ${
                      option?.examType?.examType
                    }, ${option?.paper?.paper}, ${
                      option?.examType?.examType
                    }, ${
                      option?.maxMarks || option?.minMarks
                        ? `Marks(${
                            option?.maxMarks + ", " + option?.minMarks || ""
                          }),`
                        : ""
                    }${
                      option?.weightage
                        ? " weightage (" + option?.weightage + ")"
                        : ""
                    }`,
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

            {/* select teacher */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Select Teacher</InputLabel>
              <Autocomplete
                size="small"
                id="highlights-demo"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.teachers || []}
                value={selectedData?.teacher || null}
                getOptionLabel={(option) =>
                  option?.firstName +
                  " " +
                  option?.middleName +
                  " " +
                  option?.lastName
                }
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    teacher: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Teacher" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(
                    option?.firstName +
                      " " +
                      option?.middleName +
                      " " +
                      option?.lastName,
                    inputValue,
                    {
                      insideWords: true,
                    }
                  );
                  const parts = parse(
                    option?.firstName +
                      " " +
                      option?.middleName +
                      " " +
                      option?.lastName,
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

            {/* select schedule date */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Schedule Date</InputLabel>
              {!editValue?.id && (
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
                        // value={date?.scheduleDate}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            scheduleDate: newValue?.format(),
                          }))
                        }

                        // label="Father DOB"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                            scheduleDate: newValue?.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.scheduleDate || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>

            {/* Start Time */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Start Time</InputLabel>
              {!editValue?.id && (
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
                      <TimePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        required={true}
                        // value={date?.scheduleDate}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            startTime: newValue?.format(),
                          }))
                        }
                        // label="Father DOB"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                      <TimePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            startTime: newValue?.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.startTime || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>

            {/* End Time */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>End Time</InputLabel>
              {!editValue?.id && (
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
                      <TimePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        // value={date?.scheduleDate}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            endTime: newValue?.format(),
                          }))
                        }
                        // label="Father DOB"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                      <TimePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            endTime: newValue?.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.endTime || null)}
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
      </Paper>
    </form>
  );
};

export default ExamScheduleForm;
