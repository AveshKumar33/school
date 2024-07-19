import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  TablePagination,
  Card,
  Box,
  Button,
  Grid,
  Paper,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import TableSkeleton from "../../UI/Skeleton";
import { authActions } from "../../../redux/auth-slice";
import Modal from "../../UI/Modal";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import instance from "../../../util/axios/config";
import { httpActions, deleteDataById } from "../../../redux/http-slice";
import classes from "../styles.module.css";

const ManageTransportList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [index, setIndex] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  // store data fetch from db
  const [data, setData] = useState({
    sessions: [],
    standard: [],
    section: [],
    students: [],
  });

  const [allStandard, setAllStandard] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState([]); // get standard/userType
  const [section, setSection] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [session, setSession] = useState(null);
  const [filterdTransportData, setFilterdTransportData] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    session: null,
    section: [],
    standard: [],
    startDate: null,
    endDate: null,
    student: [],
  });

  const { updatedData, deletedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    setSection([]);
    setData((prevState) => ({ ...prevState, section: [] }));

    const sectionData = selectedStandard?.map((stndr) => {
      const matchingItem = allStandard.find((obj) => obj._id === stndr.value);
      return matchingItem ? matchingItem.sections : [];
    });

    const sections = sectionData.flat();
    const uniqueSectionsArray = Array.from(
      new Set(sections.map(JSON.stringify))
    ).map(JSON.parse);

    const allSectionData = uniqueSectionsArray.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setData((prevState) => ({ ...prevState, section: allSectionData }));
  }, [selectedStandard, allStandard]);

  // fetch session or routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        setData((prevData) => ({
          ...prevData,
          sessions: sessionResp.data.data,
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
    fetchData();
  }, [dispatch]);

  // fetch standard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.get(
          "/standard/all?search=" + JSON.stringify({ session: session?.name })
        );

        const standard = response?.data?.data;
        setAllStandard(standard);
        const allData = standard?.map((item) => ({
          label: item.standard,
          value: item._id,
        }));

        setData((prevData) => ({
          ...prevData,
          standard: allData,
        }));
      } catch (error) {
        toast.error(error?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    if (session) {
      fetchData();
    }
  }, [dispatch, session]);

  // fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardId = selectedStandard?.map((standard) => standard.value);
        const sectionId = section?.map((sec) => sec.value);
        const filterData = {
          standard: standardId,
          section: sectionId,
        };

        const response = await instance.get(
          "/student/allstudent?search=" + JSON.stringify(filterData)
        );

        const students = response.data.data;
        const allData = students?.map((student) => ({
          label: `${student?.firstName} ${student?.middleName} ${student?.lastName}`,
          value: student?._id,
        }));

        setData((prevData) => ({
          ...prevData,
          students: allData,
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
          toast.error(
            error?.response?.data?.message || "Something went wrong",
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };

    if (section?.length > 0) {
      setSelectedStudent([]);
      fetchData();
    } else {
      setSelectedStudent([]);
      setData((prevState) => ({ ...prevState, students: [] }));
    }
  }, [section, dispatch, selectedStandard]);

  // setting default session year
  const initialSelectedSession = data?.sessions.find((session) => {
    return session?.active === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      setSession(initialSelectedSession);
    }
  }, [initialSelectedSession]);

  useEffect(() => {
    if (initialSelectedSession) {
      setSession(initialSelectedSession);
    }
  }, [initialSelectedSession]);

  const handleSessionChange = (event, value) => {
    setSession(value);
  };

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  useEffect(() => {
    const path = `/student-transport?page=${
      page.currentPage
    }&perPage=${rowsPerPage}&search=${JSON.stringify(searchQuery)}`;
    const fetchData = async () => {
      try {
        setLoading(true);
        const startIndex = page.currentPage * rowsPerPage + 1;
        setIndex(startIndex);
        const response = await instance.get(path);
        setFilterdTransportData(response?.data?.data);
        setPage((prevState) => ({
          ...prevState,
          totaltems: response?.data?.totalData,
        }));
        dispatch(httpActions.clearResponse());
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    fetchData();
  }, [
    page.currentPage,
    rowsPerPage,
    dispatch,
    searchQuery,
    updatedData,
    deletedData,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const handleSearch = async () => {
    const userTypeId = getId(selectedStandard); // grade/user designation
    const studentId = getId(selectedStudent);
    const sectionId = getId(section);
    const sessionName = session?.name;
    const searchData = {
      standard: userTypeId,
      student: studentId,
      section: sectionId,
      session: sessionName,
    };

    setSearchQuery(searchData);
  };

  const deleteHandler = async (data) => {
    setIsModalOpen(true);
    setIdToDelete(data);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      // const month = getMonthsName(idToDelete?.startDate, idToDelete?.endDate);

      await dispatch(
        deleteDataById({
          path: "/student-transport",
          id: idToDelete?._id,
          data: JSON.stringify({
            ...idToDelete,
            sessionName: session?.name,
          }),
        })
      ).unwrap();

      // change page no if no document available after delete
      if (filterdTransportData.length === 1 && page?.currentPage !== 0) {
        setPage((prevState) => ({
          ...prevState,
          currentPage: page?.currentPage - 1,
        }));
      }

      setIsModalOpen(false);
    } catch (error) {
      handleHttpError(error);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Delete Account
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to account name
            </p>
            <button
              className={classes["submit-btn"]}
              onClick={handleConfirmDeleteHandler}
            >
              Delete
            </button>
            <button
              className={classes["cancle-button"]}
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      <Grid className={classes.container}>
        <Paper style={{ zIndex: 2 }}>
          <CardHeader title="Get Transport Data" />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              {/* session select */}
              <Grid item md={3} sm={4} xs={12}>
                <Autocomplete
                  id="highlights-demo"
                  size="small"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.sessions || []}
                  value={session || null}
                  getOptionLabel={(sessions) => sessions?.name}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={handleSessionChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Session" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.name, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.name, matches);

                    return (
                      <li {...props} key={option?._id}>
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
              </Grid>
              {/* get user select (standard) */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 99 }}>
                <MultiSelect
                  options={data?.standard}
                  value={selectedStandard}
                  onChange={setSelectedStandard}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                />
              </Grid>
              {/* select section if student */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 98 }}>
                <MultiSelect
                  options={data?.section}
                  value={section}
                  onChange={setSection}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                />
              </Grid>

              {/* select student name */}
              <Grid item md={3} sm={4} xs={12} style={{ zIndex: 100 }}>
                <MultiSelect
                  options={data?.students}
                  value={selectedStudent}
                  onChange={setSelectedStudent}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={1}>
            <Button
              color="secondary"
              onClick={handleSearch}
              variant="contained"
            >
              Get
            </Button>
          </Box>
        </Paper>
      </Grid>
      <Grid className={classes.container}>
        <Card>
          <CardHeader subheader="Transport" title="Student Transport List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 950 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Session
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Standard
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Roll No
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Name
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
                    {filterdTransportData &&
                    filterdTransportData?.length > 0 ? (
                      filterdTransportData?.map((row, indx) => (
                        <TableRow
                          hover
                          key={row?._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {indx + index}
                          </TableCell>
                          <TableCell align="left">
                            {row?.session?.name}
                          </TableCell>
                          <TableCell align="left">
                            {`${row?.student?.standard?.standard} - ${row?.student?.section?.section}`}
                          </TableCell>
                          <TableCell align="left">
                            {row?.student?.rollNo}
                          </TableCell>
                          <TableCell align="left">
                            {row?.student?.firstName +
                              " " +
                              row?.student?.middleName +
                              " " +
                              row?.student?.lastName}
                          </TableCell>
                          <TableCell align="left">
                            {row?.transportFee}
                          </TableCell>
                          <TableCell align="left">
                            {moment(row?.startDate).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {moment(row?.endDate).format("DD-MM-YYYY")}
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
                                navigate(
                                  "/student/edit-transport-form/" + row?._id
                                );
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="text"
                              onClick={() => {
                                deleteHandler(row);
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
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
          <Divider />
          {!Loading && (
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={page.totaltems || 0}
              rowsPerPage={rowsPerPage}
              page={page.currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Grid>
    </>
  );
};

export default ManageTransportList;
