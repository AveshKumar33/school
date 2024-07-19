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

import { authActions } from "../../redux/auth-slice";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import { postData, updateDataById, fetchData } from "../../redux/http-slice";
import RouteList from "./VehicleRouteList";
import classes from "./Styles.module.css";

const VehicleRoute = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const initialState = {
    id: "",
    routeCode: "",
    vehicle: "",
    startPlace: "",
    endPlace: "",
    routeDistance: "",
    remark: "",
  };

  const [vehicleData, setVehicleData] = useState();
  const [selectedVehicleData, setSelectedVehicleData] = useState(null);
  const [editValue, setEditValue] = useState(initialState);
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const onEditHandler = (editedData) => {
    setEditValue({
      id: editedData?._id,
      routeCode: editedData?.routeCode,
      vehicle: editedData?.vehicle,
      startPlace: editedData?.startPlace,
      endPlace: editedData?.endPlace,
      routeDistance: editedData?.routeDistance,
      remark: editedData?.remark,
    });
    setValue("routeCode", editedData?.routeCode);
    setValue("startPlace", editedData?.startPlace);
    setValue("endPlace", editedData?.endPlace);
    setValue("routeDistance", editedData?.routeDistance);
    setValue("remark", editedData?.remark);
    setSelectedVehicleData(editedData?.vehicle);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const { data, Loading } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    const path = `/vehicle-details/all`;
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
      setVehicleData(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, data]);

  const { id } = editValue;

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        vehicle: selectedVehicleData?._id,
      };
      // console.log(formData);
      if (id !== "") {
        await dispatch(
          updateDataById({ path: "/routes", id: id, data: formData })
        ).unwrap();
      } else {
        await dispatch(postData({ path: "/routes", data: formData })).unwrap();
      }
      reset();
      setEditValue(initialState);
      setSelectedVehicleData(null);
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

  // console.log(editValue);

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Vehicle Route" title="Vehicle Route" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.routeCode ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="Route Code"
                  variant="outlined"
                  name="routeCode"
                  value={editValue?.routeCode || ""}
                  helperText={errors.routeCode ? "Field is required!" : ""}
                  {...register("routeCode", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <Autocomplete
                  size="small"
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={vehicleData || []}
                  value={selectedVehicleData || null}
                  getOptionLabel={(vehicleData) => vehicleData?.vehicleNumber}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedVehicleData(value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Vehicle" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.vehicleNumber, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.vehicleNumber, matches);

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
                <TextField
                  className={classes.textField}
                  error={errors.startPlace ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="Start Place"
                  variant="outlined"
                  name="startPlace"
                  value={editValue?.startPlace || ""}
                  helperText={errors.startPlace ? "Field is required!" : ""}
                  {...register("startPlace", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.endPlace ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="End Place"
                  variant="outlined"
                  name="endPlace"
                  value={editValue?.endPlace || ""}
                  helperText={errors.endPlace ? "Field is required!" : ""}
                  {...register("endPlace", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.routeDistance ? true : false}
                  size="small"
                  id="outlined-basic"
                  type="number"
                  label="Route Distance (in KMS)"
                  variant="outlined"
                  name="routeDistance"
                  value={editValue?.routeDistance || ""}
                  helperText={errors?.routeDistance ? "Field is required!" : ""}
                  {...register("routeDistance", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.remark ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="Remark/Description"
                  variant="outlined"
                  name="remark"
                  value={editValue?.remark || ""}
                  helperText={errors.remark ? "Field is required!" : ""}
                  {...register("remark", { required: true })}
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
          <CardHeader subheader="Vehicle Routes" title="Vehicle Routes List" />
          <Divider />
          <CardContent>
            <RouteList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default VehicleRoute;
