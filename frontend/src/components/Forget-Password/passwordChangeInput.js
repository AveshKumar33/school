import React from "react";
import { useSelector } from "react-redux";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";

import Grid from "@mui/material/Grid";

const PasswordChangeInput = ({ register, errors }) => {
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

  const isLoading = useSelector((state) => state.passwordChange.isLoading);

  return (
    <>
      <Typography
        sx={{ p: 0 }}
        id="transition-modal-title"
        variant="h6"
        component="h4"
        aria-required="true"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        Please Enter new password!
      </Typography>
      <Grid>
        <FormControl
          margin="normal"
          variant="outlined"
          style={{ width: "100%" }}
        >
          <InputLabel htmlFor="outlined-adornment-new-password">
            New Password
          </InputLabel>
          <OutlinedInput
            label="New Password"
            error={errors.newPassword ? true : false}
            // focused={errors.newPassword ? true : false}
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
        </FormControl>

        <FormControl
          id="confirm"
          margin="normal"
          variant="outlined"
          style={{ width: "100%" }}
        >
          <InputLabel htmlFor="outlined-adornment-confirm-password">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            label="Confirm password"
            id="outlined-adornment-confirm-password"
            error={errors.confirmPassword ? true : false}
            // focused={errors.confirmPassword ? true : false}
            type={showPassword.showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", { required: true })}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => handleClickShowPassword("showConfirmPassword")}
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
        </FormControl>
      </Grid>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Button
          variant="contained"
          size="medium"
          type="submit"
          disabled={isLoading}
          style={{ maxWidth: "100px" }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </>
  );
};

export default PasswordChangeInput;
