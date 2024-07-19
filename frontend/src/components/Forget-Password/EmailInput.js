import { useDispatch, useSelector } from "react-redux";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";

import { uiAction } from "../../redux/ui-slice";

const EmailInput = ({ userType, register, errors }) => {
  const disapatch = useDispatch();

  //   const handleNextClick = () => {
  //     disapatch(uiAction.next());
  //   };

  const isLoading = useSelector((state) => state.passwordChange.isLoading);

  const handlePreviouClick = () => {
    disapatch(uiAction.prev());
  };

  let title = "";
  let heading = "";

  if (userType === "admin") {
    heading = "Enter your email";
  }
  if (userType === "student") {
    heading = "Enter your Roll No. and Email";
    title = "Roll no.";
  }

  if (userType === "teacher") {
    heading = "Enter your Employee ID and Email";
    title = "Teacher Id.";
  }

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
        {heading}
      </Typography>
      <Grid>
        {userType !== "admin" && (
          <TextField
            error={errors.verificationId ? true : false}
            focused={errors.verificationId ? true : false}
            id="outlined-basic"
            label={title}
            variant="outlined"
            aria-required="true"
            style={{ width: "100%" }}
            sx={{ mb: 1 }}
            {...register("verificationId", {
              required: true,
            })}
          />
        )}

        <TextField
          error={errors.email ? true : false}
          focused={errors.email ? true : false}
          id="outlined-basic"
          label="Email address"
          variant="outlined"
          style={{ width: "100%" }}
          sx={{ mb: 2 }}
          {...register("email", {
            required: true,
            pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
          })}
        />
      </Grid>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <Button
          variant="contained"
          size="medium"
          style={{ maxWidth: "100px" }}
          onClick={handlePreviouClick}
          color="success"
        >
          Previous
        </Button>
        <Button
          variant="contained"
          size="medium"
          type="submit"
          disabled={isLoading}
          style={{ maxWidth: "100px" }}
          //   onClick={handleNextClick}
        >
          {isLoading ? "Sending..." : "Get OTP"}
        </Button>
      </div>
    </>
  );
};

export default EmailInput;
