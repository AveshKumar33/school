import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Divider,
} from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import instance from "../../../util/axios/config";
import styles from "./styles.module.css";
import TableSkeleton from "../../UI/Skeleton";

const StudentsFeeOutstanding = () => {
  const [fetchData, setFetchData] = useState({ feeRecords: [] });
  const [Loading, setLoading] = useState(false);

  const useQuery = () => new URLSearchParams(useLocation().search);

  let query = useQuery();

  const standard = query.get("std");
  const section = query.get("sec");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const searchData = {
          session: "",
          student: "",
          standard: standard,
          section: section,
          month: "",
          isAllPaid: "",
        };

        const {
          data: { data },
        } = await instance.get(
          "/fee-record/fee/student-total-fee?search=" +
            JSON.stringify(searchData)
        );

        setFetchData((prevState) => ({
          ...prevState,
          feeRecords: data,
        }));
        setLoading(false);
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
        setLoading(false);
      }
    };

    fetchdata();
  }, [dispatch, standard, section]);

  return (
    <Grid className={styles.container}>
      <Card>
        <CardHeader
          title="Total Outstanding"
          subheader="Total Outstanding Records for Class Sections, Displayed from April to the Current Month"
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
              <Table size="small">
                <TableHead style={{ backgroundColor: "#172B4D" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Roll. No
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Father Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Standard
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Section
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Total Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Total Discount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Total Paid
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                      Current Balance
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fetchData?.feeRecords?.length > 0 ? (
                    fetchData?.feeRecords?.map((row, index) => (
                      <TableRow hover key={index}>
                        <TableCell align="left">{index + 1}</TableCell>
                        <TableCell align="left">
                          {`${row?.student?.firstName} ${
                            row?.student?.middleName || ""
                          } ${row?.student?.lastName}`}
                        </TableCell>
                        <TableCell align="left">
                          {row?.student?.rollNo}
                        </TableCell>
                        <TableCell align="left">
                          {row?.student?.fatherName}
                        </TableCell>
                        <TableCell align="left">
                          {row?.standard?.standard}
                        </TableCell>
                        <TableCell align="left">
                          {row?.section?.section}
                        </TableCell>
                        <TableCell align="left">
                          {row?.totalAmount + row?.incrementedAmount}
                        </TableCell>
                        <TableCell align="left">{row?.totalDiscount}</TableCell>
                        <TableCell align="left">
                          {row?.totalAmount -
                            (row?.totalRemainingBalance + row?.totalDiscount)}
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{ color: "#0767DB", cursor: "pointer" }}
                        >
                          {row?.totalRemainingBalance + row?.incrementedAmount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell align="left" colSpan={4}>
                        No Data Found
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
      </Card>
    </Grid>
  );
};

export default StudentsFeeOutstanding;
