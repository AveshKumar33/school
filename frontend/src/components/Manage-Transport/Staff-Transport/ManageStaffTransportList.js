import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Card,
  Box,
  Button,
  Grid,
  Paper,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import TableSkeleton from "../../UI/Skeleton";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import { fetchData, httpActions } from "../../../redux/http-slice";
import classes from "../styles.module.css";

const ManageStaffTransportList = ({ setEditedData }) => {
  const { handleSubmit } = useForm();

  const dispatch = useDispatch();
  const httpErrorHandler = useHttpErrorHandler();

  // store data fetch from db
  const [data, setData] = useState({
    userType: [],
    staff: [],
  });

  let count = 1;

  const [selectedDesignation, setSelectedDesignation] = useState([]); // get standard/userType
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [filterdTransportData, setFilterdTransportData] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [date, setDate] = useState({ startDate: null, endDate: null });

  const {
    data: desigData,
    Loading: desigLoading,
    updatedData,
  } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    if (desigLoading === false) {
      setSelectedStaff([]);
      const allData = desigData.map((item) => ({
        label: item.title,
        value: item._id,
      }));
      setSelectedDesignation([]);
      setData((prevData) => ({
        ...prevData,
        userType: allData,
      }));
    }
  }, [dispatch, desigLoading, desigData]);

  // fetch userType(designation)
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await dispatch(fetchData({ path: "/designation/all" })).unwrap(); // getting userType
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          console.log(error);
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchAllData();
  }, [dispatch]);

  // fetch staff
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = selectedDesignation?.map((user) => user.value);
        const filterData = {
          designation: {
            $in: userId,
          },
        };
        const response = await instance.get(
          "/employee/all?data=" + JSON.stringify(filterData)
        );

        const staffData = response.data.data;
        const allData = staffData?.map((data) => ({
          label: `${data?.firstName} ${data?.middleName} ${data?.lastName}`,
          value: data._id,
        }));

        setData((prevData) => ({
          ...prevData,
          staff: allData,
        }));
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (selectedDesignation.length > 0) {
      setSelectedStaff([]);
      fetchData();
    } else {
      setSelectedStaff([]);
      setData((prevState) => ({ ...prevState, staff: [] }));
    }
  }, [selectedDesignation, dispatch]);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  const onSubmit = async () => {
    try {
      const startDate = date.startDate
        ? dayjs(date.startDate).format("YYYY-MM-DD")
        : "";
      const endDate = date.endDate
        ? dayjs(date.endDate).format("YYYY-MM-DD")
        : "";

      const userTypeId = getId(selectedDesignation); // grade/user designation
      const staffId = getId(selectedStaff);

      const searchQuery = {
        designation: userTypeId,
        employee: staffId,
        startDate: startDate,
        endDate: endDate,
      };

      setLoading(true);
      const response = await instance.get(
        "/staff-transport?search=" + JSON.stringify(searchQuery)
      );
      const res = await response?.data?.data;
      setFilterdTransportData(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      httpErrorHandler(error);
    }
  };

  useEffect(() => {
    if (updatedData) {
      onSubmit();
      dispatch(httpActions.clearResponse());
    }
  }, [updatedData]);

  return (
    <>
      <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
        <Paper style={{ zIndex: 2 }}>
          <CardHeader title="Get Transport Data" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              {/* get user select (designation / grades) */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 99 }}>
                <MultiSelect
                  options={data?.userType}
                  value={selectedDesignation}
                  onChange={setSelectedDesignation}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                />
              </Grid>
              {/* select staff name */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 100 }}>
                <MultiSelect
                  options={data?.staff}
                  value={selectedStaff}
                  onChange={setSelectedStaff}
                  labelledBy={"Select User"}
                  isCreatable={false}
                  disableSearch={false}
                />
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "100%" }}
                  className={classes.dateInp}
                  error={false}
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    className={classes.dateInp}
                    sx={{ width: "100%", mt: -1.5 }}
                    error={false}
                  >
                    <DemoItem className={classes.dateInp}>
                      <DatePicker
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "9px",
                          },
                        }}
                        value={date.startDate}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            startDate: newValue?.format(),
                          }))
                        }
                        label="Start Date"
                        className={classes.dateInp}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item md={3} sm={4} xs={12}>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "100%" }}
                  className={classes.dateInp}
                  locale="en"
                  timeZone="Asia/Kolkata"
                >
                  <DemoContainer
                    components={["DatePicker"]}
                    className={classes.dateInp}
                    sx={{ width: "100%", mt: -1.5 }}
                  >
                    <DemoItem className={classes.dateInp}>
                      <DatePicker
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "9px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        value={date.endDate}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            endDate: newValue?.format(),
                          }))
                        }
                        label="End Date"
                        className={classes.dateInp}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={1}>
            <Button color="secondary" type="submit" variant="contained">
              Get
            </Button>
          </Box>
        </Paper>
      </form>
      <Grid className={classes.container}>
        <Card>
          <CardHeader subheader="Holiday" title="Holiday List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 950 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Designation
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Name
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Mobile
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Fee
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Start Date
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        End Date
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        vehicle
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Stoppage
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes["bold-cell"]}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filterdTransportData && filterdTransportData.length > 0 ? (
                      filterdTransportData?.map((data) =>
                        data?.transportData?.map((row) => (
                          <TableRow
                            hover
                            key={row?._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {count++}
                            </TableCell>
                            <TableCell align="left">
                              {row?.employee?.designation?.title}
                            </TableCell>
                            <TableCell align="left">
                              {row?.employee?.firstName +
                                " " +
                                row?.employee?.middleName +
                                " " +
                                row?.employee?.lastName}
                            </TableCell>
                            <TableCell align="left">
                              {row?.employee?.mobileNo}
                            </TableCell>
                            <TableCell align="left">
                              {row?.stoppage?.transportFee}
                            </TableCell>
                            <TableCell align="left">
                              {moment(row?.startDate).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="left">
                              {moment(row?.endDate).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell align="left">
                              {row?.route?.vehicle?.vehicleNumber}
                            </TableCell>
                            <TableCell align="left">
                              {row?.stoppage?.stoppageName}
                            </TableCell>
                            <TableCell align="left">
                              <Button
                                variant="text"
                                onClick={() => {
                                  setEditedData(row);
                                  // filterList(indx);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="text"
                                // onClick={() => {
                                //   deleteHandler(row?._id);
                                // }}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableSkeleton />
            )}
            <Divider />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default ManageStaffTransportList;
