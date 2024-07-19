import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

// import { RotatingLines } from "react-loader-spinner";

import {
  Grid,
  Card,
  Chip,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TablePagination,
  Divider,
} from "@mui/material";

import AttendanceHistoryFilterForm from "./AttendanceHistoryFilterForm";
import { authActions } from "../../redux/auth-slice";
import instance from "../../util/axios/config";
import TableSkeleton from "../UI/Skeleton";
import styles from "./styles.module.css";

const AttendanceHistoryList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [index, setIndex] = useState(1);
  const [attendance, setAllAttendance] = useState([]);
  const [searchData, setSearchData] = useState({
    session: null,
    standard: null,
    section: [],
    searchText: "",
    status: null,
  });
  const [Loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const path = `/student-attend/all?page=${
    page.currentPage
  }&search=${JSON.stringify(searchData)}&perPage=${rowsPerPage}`;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const startIndex = page.currentPage * rowsPerPage + 1;
      setIndex(startIndex);
      const response = await instance.get(path);

      setPage((prevState) => ({
        ...prevState,
        totaltems: response?.data?.totalData,
      }));

      setAllAttendance(response?.data?.data);
      setLoading(false);
    } catch (error) {
      if (
        error?.response.data?.status === 401 ||
        error?.response.data?.status === 500
      ) {
        setLoading(false);
        toast.error("Please login again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        dispatch(authActions.logout());
      } else {
        setLoading(false);
        toast.error(error?.response.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  }, [dispatch, page.currentPage, rowsPerPage, path]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage((prevPage) => ({
      ...prevPage,
      currentPage: 0,
    }));
  }, [searchData]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  return (
    <>
      <AttendanceHistoryFilterForm setSearchData={setSearchData} />
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            title="Attendance History List"
            subheader="Attendance History"
            className={styles.customCardHeader}
            classes={{
              subheader: styles.customSubheader,
              title: styles.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Session
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Roll No
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Standard
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Section
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Name
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Mobile No
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Att. Date
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Att. Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance && attendance.length > 0 ? (
                      attendance.map((row, indx) => (
                        <TableRow
                          hover
                          key={indx}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + indx}
                          </TableCell>
                          <TableCell align="left">
                            {row?.session?.name}
                          </TableCell>
                          <TableCell align="left">
                            {row?.attendance?.student?.rollNo}
                          </TableCell>
                          <TableCell align="left">
                            {row?.standard?.standard}
                          </TableCell>
                          <TableCell align="left">
                            {row?.section?.section}
                          </TableCell>
                          <TableCell align="left">
                            {row?.attendance?.student?.firstName +
                              " " +
                              row?.attendance?.student?.middleName +
                              " " +
                              row?.attendance?.student?.lastName}
                          </TableCell>
                          <TableCell align="left">
                            {row?.attendance?.student?.parentMobileNo}
                          </TableCell>
                          <TableCell align="left">
                            {moment(row?.date).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {row?.attendance?.status === "present" && (
                              <Chip
                                label="Present"
                                color="success"
                                size="small"
                              />
                            )}

                            {row?.attendance?.status === "absent" && (
                              <Chip label="Absent" color="error" size="small" />
                            )}

                            {row?.attendance?.status === "leave" && (
                              <Chip
                                label={`Leave (${row?.attendance?.leaveType})`}
                                style={{
                                  backgroundColor: "#ffc107",
                                  color: "white",
                                }}
                                size="small"
                              />
                            )}

                            {row?.attendance?.status === "notMarked" && (
                              <Chip
                                label="Not Marked"
                                style={{
                                  backgroundColor: "#ff5722",
                                  color: "white",
                                }}
                                size="small"
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
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
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default AttendanceHistoryList;
