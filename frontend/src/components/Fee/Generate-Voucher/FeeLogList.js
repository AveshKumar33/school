import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import moment from "moment";

import {
  TableCell,
  TableRow,
  Button,
  Box,
  Typography,
  Collapse,
  Divider,
  Tooltip,
  TableHead,
  TableBody,
  Table,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { pdfDownload } from "../../../redux/http-slice";
import downloadGif from "../../../assets/download.gif";
import styles from "./styles.module.css";

const FeeLogList = ({
  slNo,
  row,
  handleApprovedClick,
  handleCancleClick,
  handleRevokedClick,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const httpErrorHandler = useHttpErrorHandler();
  const dispatch = useDispatch();

  const handlePdfDownload = async (searchData) => {
    try {
      setLoading(true);
      const searchQuery = {
        session: searchData.session.name,
        student: searchData.student,
        standard: searchData.standard,
        section: searchData.section,
        receiptNo: searchData?._id?.receiptNo,
        isBankPaid: searchData?.isBankPaid,
        isCancel: searchData?.isCancel,
      };

      await dispatch(
        pdfDownload({
          path: "/pdf/fee-voucher?search=" + JSON.stringify(searchQuery),
          fileName: "Fee Slip",
        })
      ).unwrap();
      setLoading(false);
    } catch (error) {
      httpErrorHandler(error);
      setLoading(false);
    }
  };

  return (
    <>
      <TableRow
        onClick={() => setOpen(!open)}
        className={
          row?.isApproved ? styles.approved : row?.isCancel ? styles.cancel : ""
        }
      >
        <TableCell>{slNo + 1}</TableCell>
        <TableCell>{row?._id?.receiptNo}</TableCell>
        <TableCell>{`${row?.months}`}</TableCell>
        <TableCell>
          {/* {moment(new Date(row?.voucherGeneratedDate)).format("DD-MM-YYYY")} */}
          {row?.voucherGeneratedDate}
        </TableCell>
        <TableCell>{`${row?.totalPayableAmount}`}</TableCell>
        <TableCell sx={{ display: "flex" }}>
          <Button
            onClick={() => {
              return handleApprovedClick(row);
            }}
            variant="text"
            color="success"
            disabled={row?.isApproved || row?.isCancel}
          >
            {row?.isApproved && "Approved"}

            {!row?.isApproved && !row?.isCancel && "Approve"}

            {row?.isCancel && "Cancelled"}
          </Button>
          {(row?.log?.isApproved || row?.isCancel) && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Tooltip>
            {loading ? (
              <img
                style={{ padding: "5px" }}
                className={styles.pdf}
                width="30"
                height="30"
                src={downloadGif}
                alt="_download"
              />
            ) : (
              <span
                className={styles.pdf}
                onClick={() => {
                  return handlePdfDownload(row);
                }}
              >
                <PictureAsPdfIcon color="error" />
              </span>
            )}
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow
        className={
          row?.isApproved
            ? styles.approvedData
            : row?.isCancel
            ? styles.cancelData
            : styles.rows
        }
      >
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>History</span>
                {row?.isCancel && (
                  <Button
                    onClick={() => handleRevokedClick(row)}
                    variant="outlined"
                    size="small"
                    color="success"
                  >
                    Revoke
                  </Button>
                )}

                {row?.isApproved && (
                  <Button
                    onClick={() => handleCancleClick(row)}
                    variant="outlined"
                    size="small"
                    color="warning"
                  >
                    Cancel
                  </Button>
                )}
              </Typography>
              <Divider />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Fee Head</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Paid Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Remaining Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.logs?.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{`${log?.feeHead.name} (${log?.month})`}</TableCell>
                      <TableCell>{log?.fee + log?.incrementedAmount}</TableCell>
                      <TableCell>{log?.log?.payableAmount}</TableCell>
                      <TableCell>{log?.log?.remainingAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {/* {row?.log?.isApproved && (
        <TableRow className={styles.approvedData}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Divider />
                <Grid
                  container
                  spacing={1}
                  wrap="wrap"
                  mt={1}
                  style={{ margin: "auto" }}
                >
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Receipt No:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.receiptNo}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Payment Date:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>
                      {moment(row?.log?.date).format("DD-MMM-YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Payable Amount:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.payableAmount}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Transaction Number:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.transactionNumber}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Created By:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.createdBy?.name}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Approved By:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.approvedBy?.name}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Approved Date:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>
                      {moment(row?.log?.approvedDate).format("DD-MMM-YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Button
                      onClick={() => handleCancleClick(row)}
                      variant="outlined"
                      color="warning"
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      {row?.log?.isCancel && (
        <TableRow className={styles.cancelData}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Divider />
                <Grid
                  container
                  spacing={1}
                  wrap="wrap"
                  mt={1}
                  style={{ margin: "auto" }}
                >
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Receipt No:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.receiptNo}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Payment Date:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>
                      {moment(row?.log?.date).format("DD-MMM-YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Transaction Number:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.transactionNumber}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Payable Amount:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.payableAmount}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Created By:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.createdBy?.name}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Approved By:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.approvedBy?.name}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Cancelled Date:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>
                      {moment(row?.log?.cancelDate).format("DD-MMM-YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Cancelled By:
                    </Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.cancelBy?.name}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography sx={{ fontWeight: "bold" }}>Reason:</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Typography>{row?.log?.cancelReason}</Typography>
                  </Grid>
                  <Grid item md={3} sm={6} xs={6}>
                    <Button
                      onClick={() => handleRevokedClick(row)}
                      variant="outlined"
                      color="success"
                    >
                      Revoke
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )} */}
    </>
  );
};

export default FeeLogList;
