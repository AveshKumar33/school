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

const RowData = ({ row, indx, index }) => {
  const [open, setOpen] = useState(false);
  const [remarkValue, setRemarkValue] = useState({
    id: row?.employee?._id,
    remark: row?.remark,
  });

  const handleHttpError = useHttpErrorHandler();
  const dispatch = useDispatch();

  const { remark } = remarkValue;

  useEffect(() => {
    const postStaffAttendance = async (empId, remark) => {
      try {
        const data = {
          employee: empId,
          remark: remark,
        };

        dispatch(postAttendance({ path: "/staff-attend", data }));
      } catch (error) {
        console.log(error);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      if (remarkValue?.id) {
        postStaffAttendance(remarkValue?.id, remarkValue.remark);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [remark]);

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
      const empId = value.split("_")[1];
      const status = value.split("_")[0];
      const data = {
        employee: empId,
        status: status,
        leaveType: "",
      };
      if (status !== "leave") {
        setOpen(false);
        await dispatch(
          postAttendance({ path: "/staff-attend", data })
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
      const empId = value.split("_")[1];
      const leaveType = value.split("_")[0];
      const data = {
        employee: empId,
        status: "leave",
        leaveType: leaveType,
      };
      // console.log(data);
      if (leaveType && empId) {
        await dispatch(
          postAttendance({ path: "/staff-attend", data })
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

  return (
    <>
      <TableRow
        hover
        key={row?.employee?._id}
        sx={{
          "&:last-child td, &:last-child th": { border: 0 },
        }}
      >
        <TableCell scope="row">{index + indx}</TableCell>
        <TableCell align="left">{row?.employee?.designation?.title}</TableCell>
        <TableCell align="left">
          {row?.employee?.salutation} {row?.employee?.firstName + " "}
          {row?.employee?.middleName} {row?.employee?.lastName}
        </TableCell>
        <TableCell>{row?.employee?.mobileNo}</TableCell>
        <TableCell align="left">
          <RadioGroup
            row
            id={row.employee?._id}
            onChange={handleChange}
            defaultValue={`${row?.status}_${row.employee?._id}`}
          >
            <FormControlLabel
              name="present"
              value={`present_${row?.employee?._id}`}
              control={
                <Radio
                  style={{ color: "#357a38", padding: "1px" }}
                  color="success"
                />
              }
              label={
                <Chip
                  name={row?.employee?._id}
                  label="Present"
                  color="success"
                  size="small"
                />
              }
            />

            <FormControlLabel
              name="absent"
              value={`absent_${row?.employee?._id}`}
              onChange={handleChange}
              control={
                <Radio
                  name={row?.employee?._id}
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
              value={`leave_${row?.employee?._id}`}
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
              value={`notMarked_${row?.employee?._id}`}
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
            id={row?.employee?._id}
            name={row?.employee?._id}
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
                defaultValue={`${row?.leaveType}_${row?.employee?._id}`}
              >
                <FormControlLabel
                  name="fullDay"
                  value={`fullDay_${row?.employee?._id}`}
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
                  value={`halfDay_${row?.employee?._id}`}
                  control={
                    <Radio style={{ color: "#f50057", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.employee?._id}
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
                  value={`ml_${row?.employee?._id}`}
                  control={
                    <Radio style={{ color: "#9c27b0", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.employee?._id}
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
                  value={`cl_${row?.employee?._id}`}
                  control={
                    <Radio style={{ color: "#009688", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.employee?._id}
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
                  value={`el_${row?.employee?._id}`}
                  control={
                    <Radio style={{ color: "#673ab7", padding: "1px" }} />
                  }
                  label={
                    <Chip
                      name={row?.employee?._id}
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
