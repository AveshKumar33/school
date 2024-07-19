import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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

import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import classes from "../styles.module.css";

const ExamFilter = ({ setSearchData, setData: setPaperData }) => {
  const dispatch = useDispatch();

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    exam: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: null,
    exam: null,
  });

  useEffect(() => {
    const sectionData = selectedData?.standard?.sections;

    setData((prevState) => ({ ...prevState, section: sectionData }));
  }, [selectedData?.standard]);

  // fetch paper
  useEffect(() => {
    const getPaper = async (searchQuery) => {
      try {
        const paperResp = await instance.get(
          `/paper-map/all?search=${JSON.stringify(searchQuery)}`
        );

        const examData = paperResp.data.data;

        // console.log(examData);

        setPaperData((prevState) => ({
          ...prevState,
          examPaperMap: examData,
        }));

        let allExam = {};

        examData.forEach((item) => {
          const examKey = `${item.examName.examName} (${item.examType.examType})`;
          if (!allExam[examKey]) {
            allExam[examKey] = {
              examId: `${item.examName._id}_${item.examType._id}`,
              exam: `${item.examName.examName} (${item.examType.examType})`,
              paperIds: [],
            };
          }

          if (item.paper && item.paper._id) {
            allExam[examKey].paperIds.push(item.paper._id);
          }
        });

        const uniqueExamsArray = Object.values(allExam);

        setData((prevData) => ({
          ...prevData,
          exam: uniqueExamsArray,
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
    if (selectedData?.section && selectedData?.standard) {
      const searchData = {
        standard: selectedData?.standard?._id,
        sections: selectedData?.section?._id,
      };
      getPaper(searchData);
    }
  }, [selectedData?.section, selectedData?.standard, setPaperData]);

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

  // fetch standard
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
    if (
      selectedData?.session &&
      selectedData?.standard &&
      selectedData?.section &&
      selectedData?.exam
    ) {
      setSearchData({
        session: selectedData?.session?._id,
        standard: selectedData?.standard?._id,
        section: selectedData?.section?._id,
        exam: selectedData?.exam?.examId,
        papers: selectedData?.exam?.paperIds,
      });
    } else {
      toast.error("Please select all fields!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <Grid className={classes.container}>
      <Paper style={{ zIndex: 1 }} className={classes.container}>
        <CardHeader title="Filter Exam Schedule" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            {/* session select */}
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                id="sessions"
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

            {/* select standatd */}
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                id="standard"
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

                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: null,
                    exam: null,
                  }));
                  setData((prevState) => ({
                    ...prevState,
                    section: [],
                    exam: [],
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
              <Autocomplete
                id="section"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.section || []}
                value={selectedData?.section || null}
                getOptionLabel={(option) => option?.section}
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
                  <TextField
                    {...params}
                    placeholder="Section"
                    required={true}
                  />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.section, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.section, matches);

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

            {/* select exam */}
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                id="exam"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.exam || []}
                value={selectedData?.exam || null}
                getOptionLabel={(option) => option?.exam}
                isOptionEqualToValue={(option, value) =>
                  option?.examId === value?.examId
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    exam: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Exam" required={true} />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.exam, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.exam, matches);

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

export default ExamFilter;
