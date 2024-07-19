import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import instance from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import classes from "./styles.module.css";

const attendanceStatus = [
  { label: "Present", value: "present" },
  { label: "Absent", value: "absent" },
  { label: "Leave", value: "leave" },
  { label: "Not Marked", value: "notMarked" },
];

const AttendanceHistoryFilterForm = ({ setSearchData }) => {
  const dispatch = useDispatch();

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
  });
  const [date, setDate] = useState({ from: null, to: null });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: [],
    attendanceStatus: null,
  });

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setSelectedData((prevState) => ({ ...prevState, section: [] }));
    setData((prevState) => ({ ...prevState, section: [] }));

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

  // fetch session, and standard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardResp = await instance.get(
          "/standard/all?search=" +
            JSON.stringify({ session: selectedData?.session?.name })
        );

        setData((prevData) => ({
          ...prevData,
          standard: standardResp?.data?.data,
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
      setSelectedData((prevState) => ({
        ...prevState,
        session: initialSelectedSession,
      }));
    }
  }, [initialSelectedSession]);

  const handleSearchClick = () => {
    const from = date?.from ? dayjs(date.from).format("YYYY-MM-DD") : "";

    const to = date?.to ? dayjs(date.to).format("YYYY-MM-DD") : "";

    setSearchData({
      session: selectedData?.session?._id,
      standard: selectedData?.standard?._id,
      section: getId(selectedData?.section),
      searchText: searchText,
      status: selectedData?.attendanceStatus?.value,
      from: from,
      to: to,
    });
  };

  return (
    <Grid className={classes.container}>
      <Paper style={{ zIndex: 1 }} className={classes.container}>
        <CardHeader
          subheader="Filter Attendance"
          //   title="Filter Paper Map"
        />
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
                value={selectedData?.session || null}
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

            <Grid item md={3} sm={4} xs={12}>
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
                      value={date?.from}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        setDate((prevState) => ({
                          ...prevState,
                          from: newValue?.format(),
                        }))
                      }
                      label="From"
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            <Grid item md={3} sm={4} xs={12}>
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
                      value={date?.to}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        setDate((prevState) => ({
                          ...prevState,
                          to: newValue?.format(),
                        }))
                      }
                      label="To"
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>

            {/* select standatd */}
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.standard || []}
                value={selectedData?.standard || null}
                getOptionLabel={(options) => options?.standard}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Standard" />
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
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 199 }}>
              <MultiSelect
                options={data?.section || []}
                value={selectedData?.section || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                  }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>

            {/* select attendance Status */}
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={attendanceStatus || []}
                value={selectedData?.attendanceStatus || null}
                getOptionLabel={(options) => options?.label}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    attendanceStatus: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Attendance status" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.label, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.label, matches);

                  return (
                    <li {...props}>
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
                id="searchText"
                size="small"
                label="Search by Name/Roll No"
                variant="outlined"
                name="searchText"
                type="search"
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default AttendanceHistoryFilterForm;
