import React, { useState, useEffect } from "react";
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
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { postData, updateDataById } from "../../../redux/http-slice";
import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import { fetchData, httpActions } from "../../../redux/http-slice";
import classes from "../styles.module.css";

const ManageStaffTransportForm = ({ editedData, setEditedData }) => {
  const { register, handleSubmit, setValue } = useForm();

  const dispatch = useDispatch();
  const httpErrorHandler = useHttpErrorHandler();

  const initialState = {
    id: "",
    usetType: null,
    startDate: null,
    endDate: null,
    description: "",
  };
  const [editValue, setEditValue] = useState(initialState);

  // store data fetch from db
  const [data, setData] = useState({
    userType: [],
    section: [],
    vehiclesRoutes: [],
    staff: [],
    stoppage: [],
  });

  const [selectedDesignation, setSelectedDesignation] = useState([]); // get userType
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [selectedVehicleRoute, setSelectedVehicleRoute] = useState(null);
  const [selectedRouteStoppage, setSelectedRouteStoppage] = useState(null);
  const [transportFee, setTransportFee] = useState(0);

  const [date, setDate] = useState({ startDate: null, endDate: null });

  const {
    data: desigData,
    response,
    Loading: desigLoading,
  } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    // console.log("section", modifiedArray(editedData?.section, "section"));
    if (editedData) {
      setEditValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
        startDate: editedData?.startDate,
        endDate: editedData?.endDate,
        description: editedData?.description,
      }));

      setSelectedDesignation([
        {
          label: editedData?.employee?.designation?.title,
          value: editedData?.employee?.designation?._id,
        },
      ]);
      setSelectedStaff([
        {
          label: `${editedData?.employee?.firstName} ${editedData?.employee?.middleName} ${editedData?.employee?.lastName}`,
          value: `${editedData?.employee?._id}_${editedData?.employee?.designation?._id}`,
        },
      ]);

      setSelectedVehicleRoute(editedData?.route);
      setSelectedRouteStoppage(editedData?.stoppage);

      setDate({
        startDate: editedData?.startDate,
        endDate: editedData?.endDate,
      });

      setValue("description", editedData?.description);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [editedData, setValue]);

  // fetch  routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const routsResp = await instance.get("/routes/all");

        setData((prevData) => ({
          ...prevData,
          vehiclesRoutes: routsResp.data.data,
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

  useEffect(() => {
    if (desigLoading === false) {
      setSelectedStaff([]);
      const allData = desigData.map((item) => ({
        label: item.title,
        value: item._id,
      }));
      setSelectedDesignation([]);
      setData((prevData) => ({
        ...prevData,
        userType: allData,
      }));
    }
  }, [dispatch, desigLoading, desigData]);

  // fetch userType(designation)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await dispatch(fetchData({ path: "/designation/all" })).unwrap(); // getting userType
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
          console.log(error);
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchAllData();
  }, [dispatch]);

  // fetch staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = selectedDesignation?.map((user) => user.value);
        const filterData = {
          designation: {
            $in: userId,
          },
        };
        const response = await instance.get(
          "/employee/all?data=" + JSON.stringify(filterData)
        );

        const staffData = response.data.data;
        const allData = staffData?.map((data) => ({
          label: `${data?.firstName} ${data?.middleName} ${data?.lastName}`,
          value: `${data._id}_${data.designation._id}`,
        }));

        setData((prevData) => ({
          ...prevData,
          staff: allData,
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

    if (selectedDesignation.length > 0 && editValue?.id === "") {
      setSelectedStaff([]);
      fetchData();
    } else if (selectedDesignation.length === 0 || editValue?.id === "") {
      setSelectedStaff([]);
      setData((prevState) => ({ ...prevState, staff: [] }));
    } else if (editValue?.id !== "") {
      fetchData();
    }
  }, [selectedDesignation]);

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

    if (selectedVehicleRoute && editValue?.id === "") {
      setSelectedRouteStoppage(null);
      fetchData();
    } else if (!selectedVehicleRoute || editValue?.id === "") {
      setSelectedRouteStoppage(null);
      setData((prevState) => ({ ...prevState, stoppage: [] }));
    } else if (selectedVehicleRoute && editValue?.id !== "") {
      fetchData();
    } else if (selectedRouteStoppage || !selectedVehicleRoute) {
      setSelectedRouteStoppage(null);
    }
  }, [selectedVehicleRoute]);

  const handleRouteChange = () => {
    setSelectedRouteStoppage(null);
  };

  // setting transport fee
  useEffect(() => {
    if (selectedRouteStoppage) {
      setTransportFee(selectedRouteStoppage?.transportFee);
    } else {
      setTransportFee(0);
    }
  }, [selectedRouteStoppage]);

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  // populating existing staff data if already exist in database
  useEffect(() => {
    if (response) {
      const data = response.data;
      if (data?.length > 0 && response.status === "Success") {
        data?.forEach((staffData) => {
          toast.info(
            `${staffData?.firstName} ${staffData?.middleName} ${staffData?.lastName}` +
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
  }, [response]);

  const onSubmit = async () => {
    try {
      const startDate = date.startDate
        ? dayjs(date.startDate).format("YYYY-MM-DD")
        : "";
      const endDate = date.endDate
        ? dayjs(date.endDate).format("YYYY-MM-DD")
        : "";

      const routeId = selectedVehicleRoute?._id;
      const stoppageId = selectedRouteStoppage?._id;
      const description = editValue?.description;

      const staffData = [];
      const designationMap = new Map();

      selectedStaff.forEach((staff) => {
        const [staffId, desigId] = staff?.value.split("_");

        const key = desigId;

        if (!designationMap.has(key)) {
          designationMap.set(key, {
            designation: desigId,
            transportData: [],
          });
        }

        const entry = designationMap.get(key);

        entry.transportData.push({
          employee: staffId,
          route: routeId,
          stoppage: stoppageId,
          endDate: endDate,
          startDate: startDate,
          description: description,
        });
      });

      staffData.push(...designationMap.values());

      if (editValue.id) {
        const id = editValue?.id;
        await dispatch(
          updateDataById({
            path: "/staff-transport",
            id: id,
            data: staffData,
          })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/staff-transport", data: staffData })
        ).unwrap();
      }
      dispatch(httpActions.clearResponse());
      setEditValue(initialState);
      setDate({ startDate: null, endDate: null });
      setSelectedRouteStoppage(null);
      setSelectedVehicleRoute(null);
      setEditedData(null);
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Paper style={{ zIndex: 1 }}>
        <CardHeader subheader="Manage Staff Transport" title="Transport" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            {/* select designation */}
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 299 }}>
              <MultiSelect
                options={data?.userType}
                value={selectedDesignation}
                onChange={setSelectedDesignation}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
                disabled={editValue?.id !== ""}
              />
            </Grid>
            {/* select staff name */}
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 200 }}>
              <MultiSelect
                options={data?.staff}
                value={selectedStaff}
                onChange={setSelectedStaff}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
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
                  handleRouteChange();
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
                  value={transportFee}
                  onChange={(event) => setTransportFee(event.target.value)}
                  endAdornment={
                    <InputAdornment position="end">month</InputAdornment>
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
                            startDate: newValue.format(),
                          }))
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
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            startDate: newValue.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.startDate || null)}
                        label="Start Date"
                        className={classes.dateInp}
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
                            endDate: newValue.format(),
                          }))
                        }
                        label="End Date"
                        className={classes.dateInp}
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
                            endDate: newValue.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.endDate || null)}
                        label="End Date"
                        className={classes.dateInp}
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
  );
};

export default ManageStaffTransportForm;
