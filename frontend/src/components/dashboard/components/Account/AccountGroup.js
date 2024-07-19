import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
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

import useHttpErrorHandler from "../../../../hooks/useHttpErrorHandler";
import {
  postData,
  fetchData,
  updateDataById,
} from "../../../../redux/http-slice";
import AccountGroupList from "./AccountGroupList";
import classes from "./Styles.module.css";

const AccountGroup = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [editValue, setEditValue] = useState({
    id: "",
    name: "",
    groupUnder: null,
  });
  const [accountGroup, setAccountGroup] = useState([]);
  const [selectedAcGroup, setSelectedAcGroup] = useState(null);
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const { data, httpError, Loading, response, deletedData, updatedData } =
    useSelector((state) => state.httpRequest);

  useEffect(() => {
    if (Loading === false && !httpError && data) {
      setAccountGroup(data);
    }
  }, [dispatch, Loading, httpError, data, response, deletedData, updatedData]);

  const onEditHandler = (id, editedData) => {
    setEditValue({ id: id, name: editedData?.name });
    setSelectedAcGroup(editedData?.groupUnder);
    setValue("name", editedData?.name);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchAccountGroupData = async () => {
      try {
        await dispatch(
          fetchData({ path: "/account/account-group/all" })
        ).unwrap();
      } catch (error) {
        handleHttpError(error);
      }
    };

    fetchAccountGroupData();
  }, [dispatch, handleHttpError, response, deletedData, updatedData]);

  const { id, name } = editValue;

  const onSubmit = async (data) => {
    try {
      const formData = {
        name: name,
        groupUnder: selectedAcGroup?._id,
      };

      if (id !== "" && name !== "") {
        await dispatch(
          updateDataById({ path: "/account-group", id: id, data: formData })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/account-group", data: formData })
        ).unwrap();
      }
      reset();
      setEditValue({ id: "", name: "" });
      setSelectedAcGroup(null);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleChange = (event) => {
    setValue("name", event.target.value);
    setEditValue((prevSate) => ({ ...prevSate, name: event.target.value }));
  };

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Account Group" title="Account Group" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  error={errors.name ? true : false}
                  id="outlined-basic"
                  label="Group Name"
                  variant="outlined"
                  name="name"
                  value={editValue?.name || ""}
                  helperText={errors.name ? "Field is required!" : ""}
                  {...register("name", { required: true })}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={accountGroup || []}
                  value={selectedAcGroup || null}
                  getOptionLabel={(accountGroup) => accountGroup?.name}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onChange={(event, value) => {
                    setSelectedAcGroup(value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Group Under" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option.name, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option.name, matches);

                    return (
                      <li {...props} key={option._id}>
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
            <Button color="primary" type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Card>
      </form>

      <Grid className={classes.container}>
        <Card>
          <CardHeader
            subheader="Account Groups"
            title="Account Group List"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            <AccountGroupList onEditHandler={onEditHandler} />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default AccountGroup;
