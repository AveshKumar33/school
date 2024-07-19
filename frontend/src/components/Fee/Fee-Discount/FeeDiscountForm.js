import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
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

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import {
  postData,
  updateDataById,
  httpActions,
} from "../../../redux/http-slice";
import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import classes from "./styles.module.css";

const discountMode = [
  { label: "Actual", value: "Actual" },
  { label: "Precentage", value: "Percentage" },
];

const FeeDiscountForm = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const httpErrorHandler = useHttpErrorHandler();

  const initialState = {
    id: "",
    discountValue: "",
    description: "",
    discountName: "",
    discountMode: "",
    session: null,
    feeHead: [],
  };
  const [editValue, setEditValue] = useState(initialState);

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    feeHead: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    discountMode: null,
    feeHead: [],
  });

  // session field update left change after student admission input update
  useEffect(() => {
    if (editedData) {
      const allFeeHead = editedData?.feeHead?.map((item) => ({
        label: item?.name,
        value: item?._id,
      }));

      setSelectedData((prevState) => ({
        ...prevState,
        session: editedData?.session,
        discountMode: {
          label: editedData?.discountMode,
          value: editedData?.discountMode,
        },
        feeHead: allFeeHead,
      }));
      //   setSession(editedData?.session);

      setEditValue((prevState) => ({
        ...prevState,
        id: editedData?._id,
        discountValue: editedData?.discountValue,
        description: editedData?.description,
        discountName: editedData?.discountName,
      }));

      setValue("discountValue", editedData?.discountValue);
      setValue("description", editedData?.description);
      setValue("discountName", editedData?.discountName);
    }
  }, [editedData, setValue]);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  // fetch session, fee - head
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionResp, feeHeadResp] = await Promise.all([
          instance.get("/session/all"),
          instance.get("/fee-head/all"),
        ]);

        const allFeeHead = feeHeadResp.data.data?.map((item) => ({
          label: item?.name,
          value: item?._id,
        }));

        setData((prevData) => ({
          ...prevData,
          sessions: sessionResp?.data?.data,
          feeHead: allFeeHead,
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

  const onSubmit = async () => {
    try {
      const formData = {
        session: selectedData?.session?._id,
        feeHead: getId(selectedData?.feeHead),
        discountValue: editValue?.discountValue,
        discountName: editValue?.discountName,
        discountMode: selectedData?.discountMode?.value,
        description: editValue?.description,
      };

      // console.log(formData);

      if (editValue?.id) {
        const id = editValue?.id;
        await dispatch(
          updateDataById({
            path: "/fee-discount",
            id: id,
            data: formData,
          })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/fee-discount", data: formData })
        ).unwrap();
      }
      dispatch(httpActions.clearResponse());
      setEditValue(initialState);
      navigate("/fee/fee-discount");
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
        <CardHeader title="Fee Discount" />
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

            {/* description */}
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                error={errors.discountName ? true : false}
                id="discountName"
                label="Discount name"
                name="discountName"
                variant="outlined"
                value={editValue?.discountName || ""}
                helperText={errors.discountName ? "Field is required!" : ""}
                {...register("discountName", { required: true })}
                onChange={(event) => {
                  setEditValue((prevSate) => ({
                    ...prevSate,
                    [event.target.name]: event.target.value,
                  }));
                }}
              />
            </Grid>

            {/* Fee Head */}
            <Grid item md={4} sm={6} xs={12} style={{ zIndex: 199 }}>
              <MultiSelect
                options={data?.feeHead || []}
                value={selectedData?.feeHead || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    feeHead: value,
                  }));
                }}
                labelledBy={"Select paper"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>

            {/* select discount mode */}
            <Grid item md={4} sm={6} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={discountMode || []}
                value={selectedData?.discountMode || null}
                getOptionLabel={(options) => options?.label}
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    discountMode: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Discount Mode" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.label, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.label, matches);

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

            {/* Discount Value */}
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                error={errors.discountValue ? true : false}
                id="discountValue"
                label="Discount Value"
                name="discountValue"
                type="number"
                variant="outlined"
                value={editValue?.discountValue || ""}
                helperText={errors.discountValue ? "Field is required!" : ""}
                {...register("discountValue")}
                onChange={(event) => {
                  setEditValue((prevSate) => ({
                    ...prevSate,
                    [event.target.name]: event.target.value,
                  }));
                }}
              />
            </Grid>

            {/* description */}
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                size="small"
                className={classes.textField}
                error={errors.description ? true : false}
                id="description"
                label="Description"
                name="description"
                variant="outlined"
                value={editValue?.description || ""}
                helperText={errors.description ? "Field is required!" : ""}
                {...register("description", { required: true })}
                onChange={(event) => {
                  setEditValue((prevSate) => ({
                    ...prevSate,
                    [event.target.name]: event.target.value,
                  }));
                  setValue("description", event.target.value);
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

export default FeeDiscountForm;
