import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
import { postData, updateDataById, httpActions } from "../../redux/http-slice";
import instance from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import classes from "./styles.module.css";

const TeacherSpecializationForm = ({ editedData }) => {
  const { handleSubmit } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const httpErrorHandler = useHttpErrorHandler();

  const [editValue, setEditValue] = useState({ id: "" });

  const { response } = useSelector((state) => state.httpRequest);

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

  const modifiedArray = (arr, field) => {
    const allData = arr?.map((item) => ({
      label: item[field],
      value: item._id,
    }));

    return allData;
  };

  useEffect(() => {
    if (editedData) {
      setEditValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
      }));

      const selectedSection = [
        {
          label: editedData?.section?.section,
          value: editedData?.section?._id,
        },
      ];
      const selectedPaper = modifiedArray(editedData?.paper, "paper");

      setSelectedData({
        session: editedData?.session,
        standard: editedData?.standard,
        teacher: editedData?.teacher,
        section: selectedSection,
        paper: selectedPaper,
      });
    }
  }, [editedData]);

  useEffect(() => {
    setData((prevState) => ({ ...prevState, section: [] }));
    const selectedStandard = selectedData?.standard;

    const allSectionData = selectedStandard?.sections?.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));
  }, [selectedData?.standard, editedData?.section, editValue?.id]);

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
    if (initialSelectedSession && editValue?.id === "") {
      setSelectedData((prevState) => ({
        ...prevState,
        session: initialSelectedSession,
      }));
    }
  }, [initialSelectedSession, editValue?.id]);

  // populating existing teacher data if already exist in database
  useEffect(() => {
    if (response) {
      const data = response.data;
      if (data?.length > 0 && response.status === "Success") {
        data?.forEach((res) => {
          toast.info(
            `${res?.teacher?.firstName} ${res?.teacher?.middleName} ${res?.teacher?.lastName}` +
              " already exist in " +
              `${res?.standard?.standard}, ${res?.section?.section}`,
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

  const onSubmit = async () => {
    try {
      const { session, standard, section, teacher, paper } = selectedData;

      if (
        session &&
        standard &&
        teacher &&
        section.length > 0 &&
        paper.length > 0
      ) {
        const paperId = getId(paper);

        const formData = section.map((section) => ({
          session: session?._id,
          teacher: teacher?._id,
          standard: standard?._id,
          section: section?.value,
          paper: paperId,
        }));

        if (editValue?.id) {
          const id = editValue?.id;
          await dispatch(
            updateDataById({
              path: "/teacher-specialization",
              id: id,
              data: formData,
            })
          ).unwrap();
        } else {
          await dispatch(
            postData({ path: "/teacher-specialization", data: formData })
          ).unwrap();
        }
        dispatch(httpActions.clearResponse());
        setEditValue({ id: "" });
        navigate("/teacher-specialization");
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
      style={{ minHeight: "85vh" }}
    >
      <Paper>
        <CardHeader
          title="Teacher Specialization"
          subheader="Teacher specialization by class sections"
        />
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
                disabled={editValue?.id !== ""}
                getOptionLabel={(sessions) =>
                  sessions?.startYear + " - " + sessions.endYear
                }
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
                  const matches = match(
                    option?.startYear + " - " + option?.endYear,
                    inputValue,
                    {
                      insideWords: true,
                    }
                  );
                  const parts = parse(
                    option?.startYear + " - " + option?.endYear,
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
                disabled={editValue?.id !== ""}
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
                disabled={editValue?.id !== ""}
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
          <Button color="primary" type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Paper>
    </form>
  );
};

export default TeacherSpecializationForm;
