import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  TextField,
  Autocomplete,
} from "@mui/material";

import instance from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import { fetchData } from "../../redux/http-slice";
import styles from "./styles.module.css";
import { getSession } from "../../util/student-apis/student-apis";

const PostEnquiryFilter = ({ setSearchQuery }) => {
  const {
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const enqPurposeData = useSelector((state) => state.httpRequest);

  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    enqPurpose: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: null,
  });

  const getData = useCallback(async () => {
    const sessionData = await getSession();

    setData((prevState) => ({
      ...prevState,
      sessions: sessionData,
    }));
  }, []);

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
        toast.error(error?.response?.data?.message || "Something went wrong", {
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
      setSelectedData((prevState) => ({ ...prevState, section: null }));
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

  const onSearch = (e) => {
    e.preventDefault();
    const searchData = {
      name: searchValue,
      enquiryPurpose: selectedData?.enqPurpose?._id,
      session: selectedData?.session?._id,
      standard: selectedData?.standard?._id,
      section: selectedData?.section?._id,
    };
    setSearchQuery(searchData);
  };

  return (
    <form className={styles["container"]} onSubmit={onSearch}>
      <Card>
        <CardHeader color="primary" title="Filter Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={4} sm={6} xs={12}>
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
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.firstName ? true : false}
                size="small"
                id="firstName"
                type="search"
                value={searchValue}
                label="Search By Parent/Student/Mobile name"
                variant="outlined"
                name="firstName"
                helperText={errors.firstName ? "Field is required!" : ""}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
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
            <Grid item md={4} sm={6} xs={12}>
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
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Standard" />
                )}
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
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
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          className={styles["submit-button"]}
          pr={1}
        >
          <Button color="primary" type="submit" variant="contained">
            Search
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default PostEnquiryFilter;
