import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const SuccessMessage = ({ onClose }) => {
  return (
    <>
      <Typography
        sx={{ p: 0 }}
        id="transition-modal-title"
        variant="h6"
        component="h4"
        aria-required="true"
        color="success"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: "15px",
        }}
      >
        Success
      </Typography>
      <div style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2 }}
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default SuccessMessage;
