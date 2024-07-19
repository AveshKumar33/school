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

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import {
  postData,
  updateDataById,
  httpActions,
} from "../../../redux/http-slice";
import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import classes from "../styles.module.css";

const PaperMapForm = ({ editedData }) => {
  const { register, handleSubmit, setValue } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const httpErrorHandler = useHttpErrorHandler();

  const { response } = useSelector((state) => state.httpRequest);

  const initialState = {
    id: "",
    maxMarks: "",
    minMarks: "",
    weightage: "",
    session: null,
    section: [],
    examType: null,
    paper: [],
    selectedPaper: null,
    standard: null,
    examName: null,
  };
  const [editValue, setEditValue] = useState(initialState);

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    examType: [],
    examName: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: [],
    examType: null,
    examName: null,
    paper: [],
  });

  // session field update left change after student admission input update
  useEffect(() => {
    if (editedData) {
      setSelectedData((prevState) => ({
        ...prevState,
        session: editedData?.session,
      }));
      //   setSession(editedData?.session);

      setEditValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
        maxMarks: editedData?.maxMarks,
        minMarks: editedData?.minMarks,
        weightage: editedData?.weightage,
        selectedPaper: editedData?.paper,
      }));

      const selectedPaper = [
        {
          label: editedData?.paper?.paper,
          value: editedData?.paper?._id,
        },
      ];

      setSelectedData({
        session: editedData?.session,
        standard: editedData?.standard,
        examType: editedData?.examType,
        paper: selectedPaper,
        examName: editedData?.examName,
      });

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [editedData, setValue]);

  useEffect(() => {
    if (editValue.id === "") {
      setSelectedData((prevState) => ({ ...prevState, section: [] }));
    }

    setData((prevState) => ({ ...prevState, section: [] }));

    const sectionData = selectedData?.standard?.sections;

    const allSectionData = sectionData?.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));

    if (editedData?.sections && editValue?.id) {
      const allSelectedSectionData = editedData?.sections?.map((item) => ({
        label: item.section,
        value: item._id,
      }));
      setSelectedData((prevState) => ({
        ...prevState,
        section: allSelectedSectionData,
      }));
    }
  }, [selectedData?.standard, editedData?.sections, editValue?.id]);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  useEffect(() => {
    setData((prevSate) => ({ ...prevSate, paper: [] }));
    const getPaper = async (searchQuery) => {
      try {
        const paperResp = await instance.get(
          `/paper/all?search=${JSON.stringify(searchQuery)}`
        );

        setEditValue((prevState) => ({
          ...prevState,
          paper: paperResp.data.data,
        }));

        const allPaperData = paperResp.data.data?.map((item) => ({
          label: item?.paper,
          value: item?._id,
        }));

        setData((prevData) => ({
          ...prevData,
          paper: allPaperData,
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
  }, [
    selectedData?.section,
    selectedData?.standard,
    editValue?.id,
    editedData?.paper?.paper,
    editedData?.paper?._id,
  ]);

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

  // fetch session, exam type, and standard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [standardResp, examTypeResp, examNameResp] = await Promise.all([
          instance.get(
            "/standard/all?search=" +
              JSON.stringify({ session: selectedData?.session?.name })
          ),
          instance.get("/exam-type/all"),
          instance.get("/add-exam/all"),
        ]);

        setData((prevData) => ({
          ...prevData,
          standard: standardResp?.data?.data,
          examType: examTypeResp?.data?.data,
          examName: examNameResp?.data?.data,
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

  // populating existing staff data if already exist in database
  useEffect(() => {
    if (response) {
      const data = response.data;
      if (data?.length > 0 && response.status === "Success") {
        data?.forEach((respData) => {
          toast.info(
            `${respData?.standard?.standard}, ${respData?.section}, ${respData?.paper?.paper}` +
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

  const onSubmit = async () => {
    try {
      const sessionId = selectedData?.session?._id;
      const standardId = selectedData?.standard?._id;
      const sectionId = getId(selectedData?.section);
      const paperId = getId(selectedData?.paper);
      const examType = selectedData?.examType?._id;
      const examName = selectedData?.examName?._id;
      const maxMarks = editValue?.maxMarks;
      const minMarks = editValue?.minMarks;
      const weightage = editValue?.weightage;

      const modifiedData = [];
      const stdSectionPaperMap = new Map();

      paperId.forEach((paper) => {
        const key = `${standardId}_${examType}_${sessionId}_${paper}_${maxMarks}_${minMarks}_${weightage}`;

        if (!stdSectionPaperMap.has(key)) {
          stdSectionPaperMap.set(key, {
            session: sessionId,
            standard: standardId,
            examName: examName,
            examType: examType,
            paper: paper,
            maxMarks: maxMarks,
            minMarks: minMarks,
            weightage: weightage,
            sections: [],
          });
        }

        const entry = stdSectionPaperMap.get(key);
        entry.sections.push(...sectionId);
      });

      modifiedData.push(...stdSectionPaperMap.values());

      if (editValue?.id) {
        const formData = {
          session: sessionId,
          standard: standardId,
          sections: sectionId,
          paper: editValue?.selectedPaper?._id,
          examType: examType,
          examName: examName,
          maxMarks: maxMarks,
          minMarks: minMarks,
          weightage: weightage,
        };
        const id = editValue?.id;
        await dispatch(
          updateDataById({
            path: "/paper-map",
            id: id,
            data: formData,
          })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/paper-map", data: modifiedData })
        ).unwrap();
      }
      dispatch(httpActions.clearResponse());
      setEditValue(initialState);
      navigate("/exam/paper-map");
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <form
      className={classes.container}
      onSubmit={handleSubmit(onSubmit)}
      style={{ minHeight: "80vh" }}
    >
      <Paper style={{ zIndex: 1 }}>
        <CardHeader subheader="Standard Section Paper Map" title="Paper Map" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            {/* session select */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Session</InputLabel>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.sessions || []}
                value={selectedData?.session || null}
                disabled={editValue?.id !== ""}
                required={true}
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
                  <TextField {...params} placeholder="Session" />
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
                disabled={editValue?.id !== ""}
                required={true}
                getOptionLabel={(options) => options?.standard}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                  }));
                  setSelectedData((prevSate) => ({ ...prevSate, paper: [] }));
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
              <InputLabel>Section</InputLabel>
              <MultiSelect
                options={data?.section || []}
                value={selectedData?.section || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                    paper: [],
                  }));

                  setEditValue((prevState) => ({
                    ...prevState,
                    selectedPaper: null,
                  }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>

            {/* select paper for create */}
            {!editValue?.id && (
              <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
                <InputLabel>Paper</InputLabel>
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
              </Grid>
            )}

            {/* select paper for edit */}
            {editValue?.id && (
              <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
                <InputLabel>Paper</InputLabel>
                <Autocomplete
                  id="highlights-demo"
                  size="small"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={editValue?.paper}
                  value={editValue?.selectedPaper || null}
                  required={true}
                  getOptionLabel={(options) => options?.paper}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setEditValue((prevState) => ({
                      ...prevState,
                      selectedPaper: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Paper" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.paper, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.paper, matches);

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
            )}

            {/* select exam */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Exam</InputLabel>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
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
            {/* select exam Type */}
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Exam Type</InputLabel>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.examType || []}
                value={selectedData?.examType || null}
                required={true}
                getOptionLabel={(options) => options?.examType}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    examType: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Exam Type" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.examType, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.examType, matches);

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

            {/* maximum marks */}
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                id="maxMarks"
                label="Maximum Marks"
                name="maxMarks"
                type="number"
                variant="outlined"
                required={true}
                value={editValue?.maxMarks || ""}
                {...register("maxMarks", { required: true })}
                onChange={(event) => {
                  setEditValue((prevSate) => ({
                    ...prevSate,
                    [event.target.name]: event.target.value,
                  }));
                }}
              />
            </Grid>

            {/* minimum marks */}
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                id="minMarks"
                label="Minimum Marks"
                name="minMarks"
                required={true}
                type="number"
                variant="outlined"
                value={editValue?.minMarks || ""}
                {...register("minMarks", { required: true })}
                onChange={(event) => {
                  setEditValue((prevSate) => ({
                    ...prevSate,
                    [event.target.name]: event.target.value,
                  }));
                }}
              />
            </Grid>

            {/* weightage */}
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                id="weightage"
                label="Weightage (Optional)"
                name="weightage"
                type="number"
                variant="outlined"
                value={editValue?.weightage || ""}
                {...register("weightage")}
                onChange={(event) => {
                  setEditValue((prevSate) => ({
                    ...prevSate,
                    [event.target.name]: event.target.value,
                  }));
                }}
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

export default PaperMapForm;
