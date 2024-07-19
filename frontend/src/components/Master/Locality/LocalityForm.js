import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import instance from "../../../util/axios/config";
import styles from "./LocalityForm.module.css";

const LocalityForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const postSection = async (data) => {
    try {
      const response = await instance.post("/locality", data);

      if (response.data.status === "failed") {
        return response;
      }

      window.alert(response.data.message);

      navigate("/locality-list");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const onSubmit = (data) => {
    postSection(data);
  };

  return (
    <div className={styles["form-container"]}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className={styles["form-label"]}>Locality</label>
        <input
          className={styles["form-control"]}
          {...register("locality", { required: true })}
        />
        {errors.locality && <span>This field is required</span>}

        <div className={styles["submit-button"]}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default LocalityForm;
