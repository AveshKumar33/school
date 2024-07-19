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

import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import classes from "../styles.module.css";

const ExamScheduleFilter = ({ setSearchData }) => {
  const dispatch = useDispatch();

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    examName: [],
    // students: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: [],
    examName: null,
    // paper: [],
  });

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

  // useEffect(() => {
  //   setSelectedData((prevSate) => ({ ...prevSate, paper: [] }));
  //   setData((prevSate) => ({ ...prevSate, paper: [] }));
  //   const getPaper = async (searchQuery) => {
  //     try {
  //       const paperResp = await instance.get(
  //         `/paper/all?search=${JSON.stringify(searchQuery)}`
  //       );

  //       const allPaperData = paperResp.data.data?.map((item) => ({
  //         label: item?.paper,
  //         value: item?._id,
  //       }));

  //       setData((prevData) => ({
  //         ...prevData,
  //         paper: allPaperData,
  //       }));
  //     } catch (error) {
  //       toast.error(error?.response?.data?.message || "Something went wrong", {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //         autoClose: 2000,
  //         hideProgressBar: true,
  //         theme: "colored",
  //       });
  //     }
  //   };
  //   if (selectedData?.section?.length > 0 && selectedData?.standard) {
  //     const searchData = {
  //       standard: selectedData?.standard?._id,
  //       sections: getId(selectedData?.section),
  //     };
  //     getPaper(searchData);
  //   }
  // }, [selectedData?.section, selectedData?.standard]);

  // fetch session, exam type, and standard

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [standardResp, examResp] = await Promise.all([
          instance.get(
            "/standard/all?search=" +
              JSON.stringify({ session: selectedData?.session?.name })
          ),
          instance.get("/add-exam/all"),
        ]);

        setData((prevData) => ({
          ...prevData,
          standard: standardResp?.data?.data,
          examName: examResp?.data?.data,
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
    setSearchData({
      session: selectedData?.session?._id,
      standard: selectedData?.standard?._id,
      section: getId(selectedData?.section),
      // paper: getId(selectedData?.paper),
      examName: selectedData?.examName?._id,
    });
  };

  return (
    <Grid className={classes.container}>
      <Paper style={{ zIndex: 1 }} className={classes.container}>
        <CardHeader title="Filter Exam Schedule" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            {/* session select */}
            <Grid item md={4} sm={6} xs={12}>
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

            {/* select standatd */}
            <Grid item md={4} sm={6} xs={12}>
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
            <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
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

            {/* select paper */}
            {/* <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
              <MultiSelect
                options={data?.paper || []}
                value={selectedData?.paper || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    paper: value,
                  }));
                }}
                labelledBy={"Select paper"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid> */}

            {/* select exam */}
            <Grid item md={4} sm={6} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.examName || []}
                value={selectedData?.examName || null}
                getOptionLabel={(options) => options?.examName}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    examName: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Exam" required={true} />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.examName, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.examName, matches);

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

export default ExamScheduleFilter;
