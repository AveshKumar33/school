import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormHelperText from "@mui/material/FormHelperText";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Controller } from "react-hook-form";

const OtpInput = ({ control }) => {
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
        Please enter OTP!
      </Typography>
      <Controller
        name="otp"
        control={control}
        rules={{ validate: (value) => value.length === 6 }}
        render={({ field, fieldState }) => (
          <Box>
            <MuiOtpInput sx={{ gap: 1 }} {...field} length={6} />
            {fieldState.invalid ? (
              <FormHelperText error>OTP invalid</FormHelperText>
            ) : null}
          </Box>
        )}
      />
      <div style={{ textAlign: "center" }}>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </Button>
      </div>
    </>
  );
};

export default OtpInput;
