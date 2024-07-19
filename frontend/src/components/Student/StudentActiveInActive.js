import React, { useState } from "react";
import { toast } from "react-toastify";

import {
  Card,
  CardContent,
  Divider,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import CloseIcon from "@mui/icons-material/Close";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import instance from "../../util/axios/config";
import styles from "./StudentList.module.css";

const reason = [
  {
    label: "TC generated in current year",
    value: "TC generated in current year",
  },
  {
    label: "TC generated in previous year",
    value: "TC generated in previous year",
  },
  { label: "Fee defaulter", value: "Fee defaulter" },
  {
    label: "Left the school without information",
    value: "Left the school without information",
  },
  {
    label: "Admission cancelled/withdrawal",
    value: "Admission cancelled/withdrawal",
  },
  { label: "Other", value: "Other" },
];

const StudentActiveInActive = ({
  setStudentActiveInActiveModel,
  sessionName,
  setDataToActiveInActive,
  dataToActiveInavtive,
}) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitClick = async () => {
    try {
      setLoading(true);
      if (!selectedReason) {
        toast.error("Please select reason!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        return;
      }

      const response = await instance.put(
        "/student/status/" + dataToActiveInavtive?.data,
        selectedReason,
        {
          headers: {
            session: sessionName,
          },
        }
      );

      if (response?.data?.status === "Success") {
        toast.success(response?.data?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }

      setDataToActiveInActive((prevState) => ({
        ...prevState,
        response: response?.data?.data,
        data: "",
        status: "",
      }));
      setLoading(false);
      setStudentActiveInActiveModel(false);
    } catch (error) {
      setLoading(false);
      setStudentActiveInActiveModel(false);
      toast.error(error.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <Card>
      <div className={styles.modelHeader}>
        <Typography variant="h6" gutterBottom sx={{ padding: 0 }}>
          Active/Inactive student
        </Typography>

        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => {
            setStudentActiveInActiveModel(false);
            setDataToActiveInActive({ data: "", status: "", response: "" });
          }}
        />
      </div>
      <Divider />
      <CardContent>
        <Autocomplete
          id="highlights-demo"
          size="small"
          sx={{ width: "100%", marginTop: "10px" }}
          options={reason || []}
          value={selectedReason || null}
          getOptionLabel={(option) => option?.label}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          onChange={(event, value) => {
            setSelectedReason(value);
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Reason" />
          )}
          renderOption={(props, option, { inputValue }) => {
            const matches = match(option?.label, inputValue, {
              insideWords: true,
            });
            const parts = parse(option?.label, matches);

            return (
              <li {...props}>
                <div>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
        />

        {dataToActiveInavtive?.status === "active" && (
          <LoadingButton
            variant="contained"
            color="warning"
            sx={{ marginTop: "20px" }}
            onClick={handleSubmitClick}
          >{`Inactive in current session (${sessionName})`}</LoadingButton>
        )}

        {dataToActiveInavtive?.status === "inactive" && (
          <LoadingButton
            loading={loading}
            variant="contained"
            color="warning"
            sx={{ marginTop: "20px" }}
            onClick={handleSubmitClick}
          >{`Active in current session (${sessionName})`}</LoadingButton>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentActiveInActive;
