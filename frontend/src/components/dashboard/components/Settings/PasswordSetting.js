import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
} from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";

import classes from "./Styles.module.css";
import { changePassword } from "../../../../redux/password-slice";

const Password = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  //   const isLoading = useSelector((state) => state.passwordChange.isLoading);
  const { userType, user } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = React.useState({
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const handleClickShowPassword = (passType) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [passType]: !showPassword[passType],
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const id = user._id;

  const onSubmit = (data) => {
    if (data.confirmPassword === data.newPassword) {
      const password = { password: data.confirmPassword };

      try {
        dispatch(
          changePassword({
            type: userType,
            id: id,
            password: password,
          })
        );
        reset();
      } catch (err) {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } else {
      toast.error("Password not matched!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          {/* <FormControl
            margin="normal"
            variant="outlined"
            className={classes.textField}
          >
            <InputLabel htmlFor="outlined-adornment-current-password">
              Current Password
            </InputLabel>
            <OutlinedInput
              label="Current Password"
              id="outlined-adornment-current-password"
              type={showPassword.showCurrentPassword ? "text" : "password"}
              {...register("currentPassword", { required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      handleClickShowPassword("showCurrentPassword")
                    }
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.showCurrentPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.currentPassword && <span>This field is required</span>}
          </FormControl> */}

          <FormControl
            margin="normal"
            variant="outlined"
            className={classes.textField}
          >
            <InputLabel htmlFor="outlined-adornment-new-password">
              New Password
            </InputLabel>
            <OutlinedInput
              label="New Password"
              id="outlined-adornment-new-password"
              type={showPassword.showNewPassword ? "text" : "password"}
              {...register("newPassword", { required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("showNewPassword")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.showNewPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.newPassword && <span>This field is required</span>}
          </FormControl>

          <FormControl
            id="confirm"
            margin="normal"
            variant="outlined"
            className={classes.textField}
          >
            <InputLabel htmlFor="outlined-adornment-confirm-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              label="Confirm password"
              id="outlined-adornment-confirm-password"
              type={showPassword.showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", { required: true })}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() =>
                      handleClickShowPassword("showConfirmPassword")
                    }
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.confirmPassword && <span>This field is required</span>}
          </FormControl>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" type="submit" variant="contained">
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};

export default Password;
