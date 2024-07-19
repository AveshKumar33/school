import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import styles from "./FeeStructureForm.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const FeeInput = ({ feeDetails, onInputChange, index, value, onRemove }) => {
  return (
    <div className={styles["form-group"]}>
      <div>
        <label htmlFor="country" className={styles["form-label"]}>
          Name
        </label>
        <Stack sx={{ width: 320 }}>
          <Autocomplete
            size="small"
            id="tags-outlined"
            options={feeDetails}
            name="myName"
            value={value.name || null}
            onChange={(event, newValue) =>
              onInputChange(event, index, newValue, "name")
            }
            isOptionEqualToValue={(option, value) => option._id === value._id}
            // disabled={isDisabled?.inp ?? false}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} placeholder="select fee" />
            )}
          />
        </Stack>
      </div>

      <div className={styles["form-input"]}>
        <label htmlFor="amount" className={styles["form-label"]}>
          Amount
        </label>
        <TextField
          id={`input-${index + 1}`}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          name="numberformat"
          size="small"
          // disabled={isDisabled?.inp ?? false}
          value={value.amount || ""}
          onChange={(event) => onInputChange(event, index)}
          sx={{ width: 320 }}
          variant="outlined"
        />
      </div>

      <div className={styles["form-input"]}>
        <label htmlFor="duration" className={styles["form-label"]}>
          Duration
        </label>
        <TextField
          id="outlined-read-only-input"
          size="small"
          sx={{ width: 320 }}
          variant="outlined"
          disabled={true}
          value={value.duration || ""}
        />
      </div>
      {index !== 0 && (
        <div style={{ alignSelf: "flex-end" }}>
          <IconButton
            className={styles["delete-btn"]}
            aria-label="delete"
            onClick={() => onRemove(index)}
          >
            <DeleteIcon className={styles["delete-button"]} />
          </IconButton>
        </div>
      )}
    </div>
  );
};
export default FeeInput;
