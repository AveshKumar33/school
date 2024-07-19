import React, { useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

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
import styles from "./styles.module.css";

const FeeLogList = ({ slNo, row, onCancleClick, handleRevokeClick }) => {
  const [open, setOpen] = useState(false);

  const httpErrorHandler = useHttpErrorHandler();
  const dispatch = useDispatch();

  const handlePdfDownload = async (searchData) => {
    try {
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
          path: "/pdf/fee-slip-pdf?search=" + JSON.stringify(searchQuery),
          fileName: "Fee Slip",
        })
      ).unwrap();
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <>
      <TableRow
        className={
          row?.isApproved ? styles.approved : row?.isCancel ? styles.cancel : ""
        }
        onClick={() => setOpen(!open)}
      >
        <TableCell>{slNo + 1}</TableCell>
        <TableCell>{row?._id?.receiptNo}</TableCell>
        <TableCell>{`${row?.months}`}</TableCell>
        <TableCell>{moment(row?.date).format("DD-MM-YYYY")}</TableCell>
        <TableCell>{`${row?.totalPayableAmount}`}</TableCell>

        {/* <TableCell>{row?.log?.paymentMode}</TableCell>
        <TableCell>{row?.log?.remark}</TableCell>
        <TableCell>{row?.log?.createdBy?.name}</TableCell> */}

        <TableCell sx={{ display: "flex" }}>
          <Button
            variant="text"
            color="warning"
            disabled={row?.isCancel}
            onClick={() => {
              return onCancleClick(row);
            }}
          >
            {row?.isCancel ? "Cancelled" : "Cancel"}
          </Button>

          {row?.log?.isCancel && (
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
            <span
              className={styles.pdf}
              onClick={() => {
                return handlePdfDownload(row);
              }}
            >
              <PictureAsPdfIcon color="error" />
            </span>
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
                    onClick={() => handleRevokeClick(row)}
                    variant="outlined"
                    size="small"
                    color="success"
                  >
                    Revoke
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
    </>
  );
};

export default FeeLogList;
