import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Autocomplete,
  TextField,
} from "@mui/material";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { fetchData, postData, updateDataById } from "../../../redux/http-slice";
import { authActions } from "../../../redux/auth-slice";
import styles from "./StandardForm.module.css";

const StandardForm = ({ editedData }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editValue, setEditValue] = useState({
    id: "",
    standard: null,
    section: null,
  });
  const [section, setSection] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const handleHttpError = useHttpErrorHandler();

  const { data, Loading } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    if (editedData) {
      setEditValue((prevState) => ({ ...prevState, id: editedData?._id }));
      setValue("standard", editedData?.standard);
      setSelectedOptions(editedData?.sections);
    }
  }, [editedData, setValue]);

  useEffect(() => {
    if (!Loading && data) {
      setSection(data);
    }
  }, [Loading, data]);

  useEffect(() => {
    const fetchsection = async () => {
      try {
        await dispatch(fetchData({ path: "/section/all" })).unwrap();
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
    fetchsection();
  }, [dispatch]);

  const onSubmit = async (data) => {
    const sectionId = selectedOptions?.map((section) => section._id);

    const formData = {
      ...data,
      sectionId: sectionId,
    };
    try {
      if (editValue?.id !== "") {
        await dispatch(
          updateDataById({
            path: "/standard",
            id: editValue?.id,
            data: formData,
          })
        ).unwrap();
      } else {
        await dispatch(
          postData({ path: "/standard", data: formData })
        ).unwrap();
      }
      setEditValue({ id: "", section: "" });
      navigate("/standard-list");
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleOptionChange = (event, value) => {
    setSelectedOptions(value);
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader subheader="Add Standard" title="Standard" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={12} xs={12}>
                <TextField
                  className={styles.textField}
                  error={errors.standard ? true : false}
                  id="outlined-basic"
                  size="small"
                  label="Standard"
                  variant="outlined"
                  helperText={errors.standard ? "Field is required!" : ""}
                  {...register("standard", { required: true })}
                />
              </Grid>

              <Grid item md={6} sm={12} xs={12}>
                <Autocomplete
                  multiple
                  fullWidth
                  disableCloseOnSelect
                  size="small"
                  id="Section"
                  value={selectedOptions || []}
                  label="Section"
                  name="section"
                  options={section}
                  getOptionLabel={(option) => option.section}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  filterSelectedOptions
                  onChange={handleOptionChange}
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
            p={2}
            className={styles["submit-button"]}
          >
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Card>
      </form>
    </>
  );
};

export default StandardForm;
