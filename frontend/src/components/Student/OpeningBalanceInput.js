import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import styles from "./StudentForm.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { Grid } from "@mui/material";

const OpeningBalanceInput = ({
  feeHeades,
  onInputChange,
  index,
  value,
  onRemove,
}) => {
  return (
    <Grid container spacing={2} wrap="wrap" mb={1.5}>
      <Grid item md={5} sm={4} xs={4}>
        <Autocomplete
          size="small"
          id="tags-outlined"
          options={feeHeades}
          name="myName"
          value={value?.name?.name || null}
          onChange={(event, newValue) =>
            onInputChange(event, index, newValue, "name")
          }
          isOptionEqualToValue={(option, value) => option._id === value._id}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          renderInput={(params) => <TextField {...params} label="Fee Head" />}
        />
      </Grid>

      <Grid item md={5} sm={4} xs={4}>
        <TextField
          id={`input-${index + 1}`}
          className={styles.textField}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          name="numberformat"
          size="small"
          label="Total Amount"
          value={value.amount || ""}
          onChange={(event) => onInputChange(event, index)}
          sx={{ width: 320 }}
          variant="outlined"
        />
      </Grid>

      {index !== 0 && (
        <Grid item md={2} sm={4} xs={4}>
          <IconButton
            className={styles["delete-btn"]}
            aria-label="delete"
            onClick={() => onRemove(index)}
          >
            <DeleteIcon className={styles["delete-button"]} />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};
export default OpeningBalanceInput;
