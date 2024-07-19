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
  InputLabel,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import instance from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import classes from "./styles.module.css";

const TeacherSpecializationFilterForm = ({ setSearchData }) => {
  const dispatch = useDispatch();
  const httpErrorHandler = useHttpErrorHandler();

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    teachers: [],
    papers: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    teacher: null,
    standard: null,
    section: [],
    paper: [],
  });

  useEffect(() => {
    setData((prevState) => ({ ...prevState, section: [] }));
    const selectedStandard = selectedData?.standard;

    const allSectionData = selectedStandard?.sections?.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));
  }, [selectedData?.standard]);

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

  // fetch standard or teacher
  useEffect(() => {
    const fetchData = async () => {
      const searchQuery = {
        title: "Teacher",
      };
      try {
        const [getTeacher, StandardResp] = await Promise.all([
          instance.get(`./employee/all?data=${JSON.stringify(searchQuery)}`),
          await instance.get(
            `/standard/all?search=${JSON.stringify({
              session: selectedData?.session?.name,
            })}`
          ),
        ]);

        setData((prevData) => ({
          ...prevData,
          standard: StandardResp?.data?.data,
          teachers: getTeacher.data.data,
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
      fetchData();
    }
  }, [dispatch, selectedData?.session]);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  useEffect(() => {
    setData((prevSate) => ({ ...prevSate, papers: [] }));
    const getPaper = async (searchData) => {
      try {
        const paperResp = await instance.get(
          `/paper/all?search=${JSON.stringify(searchData)}`
        );

        const allPaperData = paperResp.data.data?.map((item) => ({
          label: item?.paper,
          value: item?._id,
        }));

        setData((prevData) => ({
          ...prevData,
          papers: allPaperData,
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

  // setting default session year
  const initialSelectedSession = data?.sessions.find((session) => {
    return session?.isActive === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      setSelectedData((prevState) => ({
        ...prevState,
        session: initialSelectedSession,
      }));
    }
  }, [initialSelectedSession]);

  const searchHandler = async () => {
    try {
      const { session, standard, section, teacher, paper } = selectedData;

      const searchData = {
        session: session?._id,
        teacher: teacher?._id,
        standard: standard?._id,
        section: getId(section),
        paper: getId(paper),
      };

      setSearchData(searchData);
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <Grid className={classes.container}>
      <Paper>
        <CardHeader title="Filter" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            {/* session select */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Select Session</InputLabel>
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
                  <TextField {...params} label="Select Teacher" />
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

            {/* get user select standatd */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Select Standard</InputLabel>
              <Autocomplete
                size="small"
                id="highlights-demo"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.standard || []}
                value={selectedData?.standard || null}
                getOptionLabel={(standardData) => standardData?.standard}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                    section: [],
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
              <InputLabel>Select Section</InputLabel>
              <MultiSelect
                options={data?.section || []}
                value={selectedData?.section}
                onChange={(value) => {
                  setSelectedData((prevSate) => ({
                    ...prevSate,
                    section: value,
                    paper: [],
                  }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
            {/* select Paper */}
            <Grid item md={4} sm={6} xs={12} style={{ zIndex: 198 }}>
              <InputLabel>Select Paper</InputLabel>
              <MultiSelect
                options={data?.papers}
                value={selectedData?.paper}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    paper: value,
                  }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" onClick={searchHandler} variant="contained">
            Search
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TeacherSpecializationFilterForm;
