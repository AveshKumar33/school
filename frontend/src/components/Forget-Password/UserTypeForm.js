import { useDispatch } from "react-redux";

import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import { uiAction } from "../../redux/ui-slice";

const UserType = ({ alignment, handleChange, error }) => {
  const disapatch = useDispatch();

  const handleNextClick = () => {
    disapatch(uiAction.next());
  };

  return (
    <>
      <Typography
        sx={{ p: 0 }}
        id="transition-modal-title"
        variant="h5"
        component="h2"
        style={{
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Select User Type
      </Typography>
      <Grid>
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
          {error && (
            <p style={{ fontSize: "13px", color: "red" }}>
              Please first select user type!
            </p>
          )}
        </div>
      </Grid>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          variant="contained"
          size="medium"
          disabled={error}
          style={{ maxWidth: "100px" }}
          onClick={handleNextClick}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default UserType;
