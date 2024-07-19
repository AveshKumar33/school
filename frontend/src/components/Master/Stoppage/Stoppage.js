import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { authActions } from "../../../redux/auth-slice";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { postData, updateDataById, fetchData } from "../../../redux/http-slice";
import StoppageList from "./StoppageList";
import classes from "./Styles.module.css";

const Stoppage = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const initialState = {
    id: "",
    route: "",
    stoppageName: "",
    stoppageAddress: "",
    designationDistance: "",
    transportFee: "",
  };

  const [editValue, setEditValue] = useState(initialState);
  const [vehiclesRoutes, setVehiclesRoutes] = useState([]);
  const [selectedVehicleRoute, setSelectedVehicleRoute] = useState(null);
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editData) => {
    setEditValue({
      id: editData?._id,
      route: editData?.route,
      stoppageName: editData?.stoppageName,
      stoppageAddress: editData?.stoppageAddress,
      designationDistance: editData?.designationDistance,
      transportFee: editData?.transportFee,
    });
    setSelectedVehicleRoute(editData?.route);
    setValue("stoppageName", editData?.stoppageName);
    setValue("stoppageAddress", editData?.stoppageAddress);
    setValue("designationDistance", editData?.designationDistance);
    setValue("transportFee", editData?.transportFee);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { data, Loading } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    const path = `/routes/all`;
    const fetchVehicleDetails = async () => {
      try {
        await dispatch(fetchData({ path })).unwrap();
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
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
    fetchVehicleDetails();
  }, [dispatch]);

  useEffect(() => {
    if (!Loading && data) {
      setVehiclesRoutes(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, data]);

  const { id } = editValue;

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        route: selectedVehicleRoute?._id,
      };

      if (id !== "") {
        await dispatch(
          updateDataById({ path: "/stoppage", id: id, data: formData })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/stoppage", data: formData })
        ).unwrap();
      }
      reset();
      setEditValue(initialState);
      setSelectedVehicleRoute(null);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setEditValue((prevSate) => ({
      ...prevSate,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Routes Stoppage" title="Add Stoppage" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={4} sm={6} xs={12}>
                <Autocomplete
                  size="small"
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={vehiclesRoutes || []}
                  value={selectedVehicleRoute || null}
                  getOptionLabel={(vehiclesRoutes) =>
                    vehiclesRoutes?.routeCode +
                    ", " +
                    vehiclesRoutes?.startPlace +
                    ", " +
                    vehiclesRoutes?.endPlace +
                    ", " +
                    vehiclesRoutes?.routeDistance +
                    " Km"
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedVehicleRoute(value);
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
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.stoppageName ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="Stoppage Name"
                  variant="outlined"
                  name="stoppageName"
                  value={editValue?.stoppageName || ""}
                  helperText={errors.stoppageName ? "Field is required!" : ""}
                  {...register("stoppageName", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.stoppageAddress ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="Stoppage Address"
                  variant="outlined"
                  name="stoppageAddress"
                  value={editValue?.stoppageAddress || ""}
                  helperText={
                    errors.stoppageAddress ? "Field is required!" : ""
                  }
                  {...register("stoppageAddress", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.designationDistance ? true : false}
                  size="small"
                  id="outlined-basic"
                  type="number"
                  label="Designation Distance"
                  variant="outlined"
                  name="designationDistance"
                  value={editValue?.designationDistance || ""}
                  helperText={
                    errors.designationDistance ? "Field is required!" : ""
                  }
                  {...register("designationDistance", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.transportFee ? true : false}
                  size="small"
                  id="outlined-basic"
                  type="number"
                  label="Transport Fee"
                  variant="outlined"
                  name="transportFee"
                  value={editValue?.transportFee || ""}
                  helperText={errors.transportFee ? "Field is required!" : ""}
                  {...register("transportFee", { required: true })}
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
        </Card>
      </form>

      <Grid className={classes.container}>
        <Card>
          <CardHeader subheader="Route Stoppage" title="Route Stoppage List" />
          <Divider />
          <CardContent>
            <StoppageList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Stoppage;
