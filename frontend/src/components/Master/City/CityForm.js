import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
} from "@mui/material";

import instance from "../../../util/axios/config";
import styles from "./CityForm.module.css";

const CityForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const postSection = async (data) => {
    try {
      const response = await instance.post("/city", data);

      if (response.data.status === "failed") {
        return response;
      }

      toast.success(response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });

      navigate("/city-list");
    } catch (error) {
      navigate("/login");
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const onSubmit = (data) => {
    postSection(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.container}
      style={{ minHeight: "85vh" }}
    >
      <Card>
        <CardHeader color="primary" title="Add City" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.city ? true : false}
                size="small"
                id="city"
                label="City Name"
                variant="outlined"
                name="city"
                helperText={errors.city ? "Field is required!" : ""}
                {...register("city", { required: true })}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <div className={styles["submit-btn"]}>
                <button type="submit">Submit</button>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

export default CityForm;
