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

import instance from "../../util/axios/config";
import styles from "./StateForm.module.css";

const StateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const postState = async (data) => {
    try {
      const response = await instance.post("/state", data);

      if (response.data.status === "failed") {
        return response;
      }

      toast.success(response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });

      navigate("/state-list");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const onSubmit = (data) => {
    postState(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.container}
        style={{ minHeight: "85vh" }}
      >
        <Card>
          <CardHeader color="primary" title="Add State" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={6} sm={6} xs={12}>
                <TextField
                  className={styles.textField}
                  error={errors.name ? true : false}
                  size="small"
                  id="outlined-basic"
                  label="State Name"
                  variant="outlined"
                  name="name"
                  helperText={errors.name ? "Field is required!" : ""}
                  {...register("name", { required: true })}
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
    </>
  );
};

export default StateForm;
