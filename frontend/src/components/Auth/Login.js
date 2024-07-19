import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../util/axios/config";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../redux/auth-slice";
import { uiAction } from "../../redux/ui-slice";
import ForgetPasswordForm from "../Forget-Password/Form";

import logo from "../../assets/logo.png";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import { Button, IconButton, TextField, Typography } from "@mui/material";

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./Login.module.css";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const disapatch = useDispatch();
  const navigate = useNavigate();

  const isModalOpen = useSelector((state) => state.ui.open);
  const [alignment, setAlignment] = useState("admin");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleOpenModal = () => {
    disapatch(uiAction.openModal(true));
  };

  const userLogin = async (data) => {
    try {
      const response = await axios.post("/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        disapatch(
          authActions.login({
            userType: response.data.userType,
            user: response.data.user,
          })
        );

        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        navigate("/dashborad");
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const onSubmit = (data) => {
    userLogin({ ...data, userType: alignment });
  };

  let title = "login with email address";

  if (alignment === "student") {
    title = "login with roll no.";
  }

  if (alignment === "teacher") {
    title = "login with Teacher Id.";
  }

  return (
    <div className={styles.container}>
      {isModalOpen && <ForgetPasswordForm />}
      <Typography className={styles.heading} variant="h4">
        Welcome
      </Typography>

      <div className={styles.Image}>
        <img src={logo} alt="__logo" />
      </div>

      <div className={styles.content}>
        {/* <div className={styles.contentHeader}>
          <Link to="/">
            <IconButton className={styles.backButton}>
              <ArrowBackIcon />
            </IconButton>
          </Link>
        </div> */}
        <div className={styles.contentBody}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div
              style={{
                textAlign: "center",
                margin: "10px 0px",
              }}
            >
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
              >
                <ToggleButton style={{ fontWeight: "600" }} value="admin">
                  Admin
                </ToggleButton>
                <ToggleButton style={{ fontWeight: "600" }} value="teacher">
                  Teacher
                </ToggleButton>
                <ToggleButton style={{ fontWeight: "600" }} value="student">
                  Student
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <Typography className={styles.title} variant="h4">
              Sign in
            </Typography>
            <Typography className={styles.subtitle} variant="body1">
              {title}
            </Typography>
            <div className={styles.fields}>
              {alignment === "admin" && (
                <>
                  <TextField
                    className={styles.textField}
                    label="Email address"
                    placeholder="example@gmail.com"
                    name="email"
                    type="text"
                    defaultValue="ajay@digisidekick.com"
                    variant="outlined"
                    {...register("email", {
                      required: true,
                      pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                    })}
                  />
                  {errors.email && <span>This field is required</span>}
                </>
              )}
              {alignment === "teacher" && (
                <>
                  <TextField
                    className={styles.textField}
                    label="Teacher ID"
                    placeholder="PC966D"
                    name="teacherId"
                    type="text"
                    variant="outlined"
                    {...register("teacherId", {
                      required: true,
                    })}
                  />
                  {errors.teacherId && <span>This field is required</span>}
                </>
              )}
              {alignment === "student" && (
                <>
                  <TextField
                    className={styles.textField}
                    label="Class Roll no."
                    placeholder="Class Roll no."
                    name="rollNo"
                    id="outlined-basic"
                    type="number"
                    variant="outlined"
                    {...register("rollNo", {
                      required: true,
                    })}
                  />
                  {errors.rollNo && <span>This field is required</span>}
                </>
              )}
              <FormControl variant="outlined" className={styles.textField}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  label="Password"
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Password"
                />
              </FormControl>
              {errors.password && <span>This field is required</span>}
            </div>
            <Button
              className={styles.signInButton}
              color="primary"
              //   disabled={!isValid}
              //   onClick={this.handleSignIn}
              size="large"
              variant="contained"
              type="submit"
            >
              Sign in now
            </Button>
            <Typography
              style={{ marginTop: "10px" }}
              className={styles.forgetPassword}
              variant="body1"
              onClick={handleOpenModal}
            >
              forget password
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
