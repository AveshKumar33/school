import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import styles from "./styles.module.css";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TablePagination,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

import { authActions } from "../../redux/auth-slice";
import TableSkeleton from "../UI/Skeleton";
import { fetchDataWithPagination } from "../../redux/http-slice";
import RowData from "./RowData";

const StaffAttendance = () => {
  const dispatch = useDispatch();

  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [index, setIndex] = useState(1);
  const [staffData, setStaffData] = useState([]);

  const { pageData, Loading, response, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setStaffData(pageData?.data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  const path = `/staff-attend`;

  useEffect(() => {
    const fetchAccountGroup = async () => {
      try {
        const startIndex = page.currentPage * rowsPerPage + 1;
        setIndex(startIndex);
        await dispatch(fetchDataWithPagination({ path })).unwrap();
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
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
    fetchAccountGroup();
  }, [
    dispatch,
    page.currentPage,
    rowsPerPage,
    path,
    response.data,
    updatedData,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  // console.log(staffData);

  return (
    <Grid className={styles.container}>
      <Card>
        <CardHeader
          subheader="Today Staff Attendaance"
          // title="Staff Attendaance"
        />
        <Divider />
        <CardContent>
          {!Loading ? (
            <TableContainer>
              <Table
                sx={{ minWidth: 1290 }}
                className={styles["table"]}
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell className={styles["bold-cell"]}>#</TableCell>
                    <TableCell align="center" className={styles["bold-cell"]}>
                      Designatioin
                    </TableCell>
                    <TableCell align="center" className={styles["bold-cell"]}>
                      Name
                    </TableCell>
                    <TableCell align="center" className={styles["bold-cell"]}>
                      Mobile
                    </TableCell>
                    <TableCell align="center" className={styles["bold-cell"]}>
                      Attendance
                    </TableCell>
                    <TableCell align="center" className={styles["bold-cell"]}>
                      Remark
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffData?.attendance && staffData?.attendance.length > 0 ? (
                    staffData?.attendance.map((row, indx) => (
                      <RowData
                        key={row?._id}
                        row={row}
                        indx={indx}
                        index={index}
                      />
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
        </CardContent>
        <Divider />
        {!Loading && pageData && (
          <TablePagination
            rowsPerPageOptions={[25, 50, 100]}
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
  );
};

export default StaffAttendance;
