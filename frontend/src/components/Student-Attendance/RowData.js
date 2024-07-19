import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  TableCell,
  TableRow,
  Chip,
  //   FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Collapse,
  Box,
} from "@mui/material";

import { postAttendance } from "../../redux/http-slice";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";

const RowData = ({ row, indx, standard = "", section = "" }) => {
  const [open, setOpen] = useState(false);
  const [remarkValue, setRemarkValue] = useState({
    id: row?.employee?._id,
    remark: row?.remark,
  });

  const handleHttpError = useHttpErrorHandler();
  const dispatch = useDispatch();

  const { remark } = remarkValue;

  useEffect(() => {
    const postStudentAttendance = async (stuId, remark) => {
      try {
        const data = {
          standard: standard?._id,
          section: section?._id,
          student: stuId,
          remark: remark,
        };

        dispatch(postAttendance({ path: "/student-attend", data }));
      } catch (error) {
        console.log(error);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      if (remarkValue?.id) {
        postStudentAttendance(remarkValue?.id, remarkValue.remark);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [
    remark,
    remarkValue?.remark,
    remarkValue?.id,
    dispatch,
    standard?._id,
    section?._id,
  ]);

  // console.log(remarkValue);

  const handleRemarkChange = (event) => {
    setRemarkValue((prevState) => ({
      ...prevState,
      id: event.target.name,
      remark: event.target.value,
    }));
  };

  const handleChange = async (event) => {
    try {
      const value = event.target.value;
      const stuId = value.split("_")[1];
      const status = value.split("_")[0];
      const data = {
        standard: standard?._id,
        section: section?._id,
        student: stuId,
        status: status,
        leaveType: "",
      };
      if (status !== "leave") {
        setOpen(false);
        await dispatch(
          postAttendance({ path: "/student-attend", data })
        ).unwrap();
      } else {
        toast.warn("Please select leave type!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  const handleLeaveChange = async (event) => {
    try {
      const value = event.target.value;
      const stuId = value.split("_")[1];
      const leaveType = value.split("_")[0];
      const data = {
        student: stuId,
        status: "leave",
        leaveType: leaveType,
      };
      // console.log(data);
      if (leaveType && stuId) {
        await dispatch(
          postAttendance({ path: "/student-attend", data })
        ).unwrap();
      } else {
        toast.warn("Please select leave type!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      handleHttpError(error);
    }
  };

  //   console.log(row);

  return (
    <>
      <TableRow
        hover
        key={row?.employee?._id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell scope="row">{indx}</TableCell>
        <TableCell align="left">
          {row?.student?.salutation} {row?.student?.firstName + " "}
          {row?.student?.middleName} {row?.student?.lastName}
        </TableCell>
        <TableCell>{row?.student?.mobileNo}</TableCell>
        <TableCell align="left">
          <RadioGroup
            row
            id={row.student?._id}
            onChange={handleChange}
            defaultValue={`${row?.status}_${row.student?._id}`}
          >
            <FormControlLabel
              name="present"
              value={`present_${row?.student?._id}`}
              control={
                <Radio
                  style={{ color: "#357a38", padding: "1px" }}
                  color="success"
                />
              }
              label={
                <Chip
                  name={row?.student?._id}
                  label="Present"
                  color="success"
                  size="small"
                />
              }
            />

            <FormControlLabel
              name="absent"
              value={`absent_${row?.student?._id}`}
              onChange={handleChange}
              control={
                <Radio
                  name={row?.student?._id}
                  style={{ color: "#aa2e25", padding: "1px" }}
                  color="error"
                />
              }
              label={
                <Chip
                  name={row?._id}
                  label="Absent"
                  color="error"
                  size="small"
                />
              }
            />
            <FormControlLabel
              name="leave"
              value={`leave_${row?.student?._id}`}
              onChange={handleChange}
              control={<Radio style={{ color: "#ffc107", padding: "1px" }} />}
              label={
                <Chip
                  label="Leave"
                  onClick={() => setOpen(!open)}
                  style={{
                    backgroundColor: "#ffc107",
                    color: "white",
                  }}
                  size="small"
                />
              }
            />

            <FormControlLabel
              name="notMarked"
              value={`notMarked_${row?.student?._id}`}
              onChange={handleChange}
              control={<Radio style={{ color: "#ff5722", padding: "1px" }} />}
              label={
                <Chip
                  label="Not Marked"
                  style={{
                    backgroundColor: "#ff5722",
                    color: "white",
                  }}
                  size="small"
                />
              }
            />
          </RadioGroup>
        </TableCell>
        <TableCell>
          <TextField
            id={row?.student?._id}
            name={row?.student?._id}
            label="Remark"
            value={remarkValue?.remark}
            onChange={handleRemarkChange}
            variant="outlined"
            size="small"
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1, display: "flex", justifyContent: "center" }}>
              <RadioGroup
                row
                onChange={handleLeaveChange}
                defaultValue={`${row?.leaveType}_${row?.student?._id}`}
              >
                <FormControlLabel
                  name="fullDay"
                  value={`fullDay_${row?.student?._id}`}
                  control={
                    <Radio style={{ color: "#01579b", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      label="Full Day"
                      style={{
                        backgroundColor: "#01579b",
                        color: "white",
                      }}
                      size="small"
                    />
                  }
                />
                <FormControlLabel
                  name="halfDay"
                  value={`halfDay_${row?.student?._id}`}
                  control={
                    <Radio style={{ color: "#f50057", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.student?._id}
                      label="Half Day"
                      style={{
                        backgroundColor: "#f50057",
                        color: "white",
                      }}
                      size="small"
                    />
                  }
                />
                <FormControlLabel
                  name="ml"
                  value={`ml_${row?.student?._id}`}
                  control={
                    <Radio style={{ color: "#9c27b0", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.student?._id}
                      label="ML"
                      style={{
                        backgroundColor: "#9c27b0",
                        color: "white",
                      }}
                      size="small"
                    />
                  }
                />
                <FormControlLabel
                  name="cl"
                  value={`cl_${row?.student?._id}`}
                  control={
                    <Radio style={{ color: "#009688", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.student?._id}
                      label="CL"
                      style={{
                        backgroundColor: "#009688",
                        color: "white",
                      }}
                      size="small"
                    />
                  }
                />
                <FormControlLabel
                  name="el"
                  value={`el_${row?.student?._id}`}
                  control={
                    <Radio style={{ color: "#673ab7", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.student?._id}
                      label="EL"
                      style={{
                        backgroundColor: "#673ab7",
                        color: "white",
                      }}
                      size="small"
                    />
                  }
                />
              </RadioGroup>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default RowData;
