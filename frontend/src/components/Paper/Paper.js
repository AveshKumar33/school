import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Grid,
  Card,
  Paper as PaperComponent,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import { postData, fetchData, updateDataById } from "../../redux/http-slice";
import PaperList from "./PaperList";
import classes from "./styles.module.css";

const Paper = () => {
  const { handleSubmit } = useForm();

  const [mode, setMode] = useState("create");
  const [editValue, setEditValue] = useState({ id: "", paper: "" });
  const [searchQuery, setSearchQuery] = useState({
    paperName: "",
    session: null,
    standard: null,
    section: [],
  });
  const [fetchedData, setFetchedData] = useState({
    standard: [],
    section: [],
  });
  const [selectedData, setSelectedData] = useState({
    selectedStandard: null,
    selectedSection: [],
  });
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const { data } = useSelector((state) => state.httpRequest);

  const handleChange = (event, value) => {
    setMode(value);
    setSelectedData({
      selectedStandard: null,
      selectedSection: [],
    });
    setEditValue({ id: "", paper: "" });
  };

  // fetch standard
  useEffect(() => {
    const fetchStandard = async () => {
      try {
        await dispatch(fetchData({ path: "/standard/all/api" })).unwrap();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    fetchStandard();
  }, [dispatch]);

  useEffect(() => {
    if (data?.length > 0) {
      setFetchedData((prevData) => ({
        ...prevData,
        standard: data,
      }));
    }
  }, [data]);

  const onEditHandler = (editedData) => {
    setMode("create");
    setEditValue({ id: editedData?._id, paper: editedData?.paper });

    const allSectionData = editedData.sections?.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setSelectedData({
      selectedStandard: editedData?.standard,
      selectedSection: allSectionData,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // set section
  useEffect(() => {
    if (selectedData?.selectedStandard) {
      if (editValue?.id === "") {
        setSelectedData((prevState) => ({ ...prevState, selectedSection: [] }));
      }
      setFetchedData((prevState) => ({ ...prevState, section: [] }));

      const sectionData = selectedData?.selectedStandard?.sections;

      const allSectionData = sectionData?.map((item) => ({
        label: item.section,
        value: item._id,
      }));

      setFetchedData((prevState) => ({
        ...prevState,
        section: allSectionData,
      }));
    } else if (editValue?.id === "") {
      setSelectedData((prevState) => ({ ...prevState, selectedSection: [] }));
      setFetchedData((prevState) => ({ ...prevState, section: [] }));
    }
  }, [selectedData?.selectedStandard, editValue?.id]);

  const { id, Paper } = editValue;

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  const onFilter = () => {
    setSearchQuery({
      paperName: editValue?.paper,
      standard: selectedData?.selectedStandard?._id,
      section: getId(selectedData?.selectedSection),
    });
  };

  const onSubmit = async () => {
    try {
      if (
        selectedData?.selectedSection?.length > 0 &&
        selectedData?.selectedStandard &&
        editValue?.paper !== ""
      ) {
        const standardId = selectedData?.selectedStandard?._id;
        const sectionId = selectedData?.selectedSection;

        const formData = {
          standard: standardId,
          section: getId(sectionId),
          paper: editValue?.paper,
        };

        if (id !== "" && Paper !== "") {
          await dispatch(
            updateDataById({ path: "/paper", id: id, data: formData })
          ).unwrap();
        } else {
          await dispatch(postData({ path: "/paper", data: formData })).unwrap();
        }
        setSelectedData({
          selectedStandard: null,
          selectedSection: [],
        });
        setEditValue({ id: "", paper: "" });
      } else {
        toast.error("All fields are required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  return (
    <>
      <Grid
        className={classes.container}
        container
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid>
          <ToggleButtonGroup
            color="primary"
            value={mode}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton style={{ fontWeight: "600" }} value="create">
              Create
            </ToggleButton>
            <ToggleButton style={{ fontWeight: "600" }} value="filter">
              Filter
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      {mode === "create" && (
        <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
          <PaperComponent>
            <CardHeader
              className={classes.customCardHeader}
              classes={{
                title: classes.customSubheader,
                subheader: classes.customTitle,
              }}
              subheader="Add Standard Paper"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2} wrap="wrap">
                <Grid item md={4} sm={6} xs={12}>
                  <Autocomplete
                    id="highlights-demo"
                    sx={{ width: "100%" }}
                    size="small"
                    style={{ width: "100%" }}
                    options={fetchedData?.standard || []}
                    value={selectedData?.selectedStandard}
                    getOptionLabel={(options) => options?.standard}
                    disabled={Boolean(editValue?.id)}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    onChange={(event, value) => {
                      setSelectedData((prevState) => ({
                        ...prevState,
                        selectedStandard: value,
                        selectedSection: [],
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
                <Grid item md={4} sm={6} xs={12} style={{ zIndex: 200 }}>
                  <MultiSelect
                    options={fetchedData?.section}
                    value={selectedData?.selectedSection}
                    onChange={(value) => {
                      setSelectedData((prevState) => ({
                        ...prevState,
                        selectedSection: value,
                      }));
                    }}
                    labelledBy={"Select Section"}
                    isCreatable={false}
                    disableSearch={true}
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    className={classes.textField}
                    id="paper"
                    size="small"
                    label="Paper Name"
                    variant="outlined"
                    value={editValue?.paper || ""}
                    name="paper"
                    onChange={(event) => {
                      setEditValue((prevState) => ({
                        ...prevState,
                        paper: event.target.value,
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
          </PaperComponent>
        </form>
      )}

      {mode === "filter" && (
        <Grid className={classes.container}>
          <PaperComponent>
            <CardHeader
              className={classes.customCardHeader}
              classes={{
                title: classes.customSubheader,
                subheader: classes.customTitle,
              }}
              subheader="Filter Standard Papers"
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2} wrap="wrap">
                <Grid item md={4} sm={6} xs={12}>
                  <Autocomplete
                    id="highlights-demo"
                    sx={{ width: "100%" }}
                    size="small"
                    style={{ width: "100%" }}
                    options={fetchedData?.standard || []}
                    value={selectedData?.selectedStandard}
                    getOptionLabel={(options) => options?.standard}
                    disabled={Boolean(editValue?.id)}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    onChange={(event, value) => {
                      setSelectedData((prevState) => ({
                        ...prevState,
                        selectedStandard: value,
                        selectedSection: [],
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
                <Grid item md={4} sm={6} xs={12} style={{ zIndex: 200 }}>
                  <MultiSelect
                    options={fetchedData?.section}
                    value={selectedData?.selectedSection}
                    onChange={(value) => {
                      setSelectedData((prevState) => ({
                        ...prevState,
                        selectedSection: value,
                      }));
                    }}
                    labelledBy={"Select Section"}
                    isCreatable={false}
                    disableSearch={true}
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    className={classes.textField}
                    id="paper"
                    size="small"
                    label="Paper Name"
                    variant="outlined"
                    value={editValue?.paper || ""}
                    name="paper"
                    onChange={(event) => {
                      setEditValue((prevState) => ({
                        ...prevState,
                        paper: event.target.value,
                      }));
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <Box display="flex" justifyContent="flex-end" p={2}>
              <Button
                color="secondary"
                type="submit"
                variant="contained"
                onClick={onFilter}
              >
                Filter
              </Button>
            </Box>
          </PaperComponent>
        </Grid>
      )}

      <Grid className={classes.container}>
        <Card>
          <CardHeader
            title="Papers"
            subheader="Standard section wise paper"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <PaperList
              onEditHandler={onEditHandler}
              searchQuery={searchQuery}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Paper;
