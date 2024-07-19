import React, { useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";

import { Card, CardContent, Grid, Typography, TextField } from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";

import instance from "../../../util/axios/config";
import styles from "./styles.module.css";

const ApprovedModel = ({
  closeModal,
  data,
  setSubmittingResponses,
  sessionName,
}) => {
  const [approvedData, setApprovedData] = useState({
    date: null,
    transitionNo: "",
  });

  const handleSubmitClick = async () => {
    try {
      if (approvedData?.date && approvedData?.transitionNo) {
        const dataToApproved = data?.dataToApproved;
        const currDate = dayjs();

        const approvedDate = currDate
          ? dayjs(currDate).format("YYYY-MM-DD")
          : "";

        const transactionDate = approvedData?.date
          ? dayjs(approvedData?.date).format("YYYY-MM-DD")
          : "";

        const formData = {
          ...dataToApproved,
          approvedDate: approvedDate,
          date: transactionDate,
          transitionNo: approvedData?.transitionNo,
        };

        const response = await instance.put(
          `fee-record/approve?search=${JSON.stringify({
            session: sessionName,
          })}`,
          formData
        );

        if (response?.data?.status === "Success") {
          toast.success(response?.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }

        setSubmittingResponses(response?.data?.data);
        closeModal();
      } else {
        toast.error("All fields are required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <Card>
      <CloseIcon className={styles.close} onClick={closeModal} />
      <CardContent>
        <Typography variant="h6" align="center" style={{ color: "#ED4740" }}>
          Are you sure?
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          style={{ color: "#ED4740" }}
        >
          You want to approved this transaction.
        </Typography>
        <Grid container spacing={1} wrap="wrap" mt={1} ml={4}>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>Receipt No:</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>{data?.dataToApproved?._id?.receiptNo}</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>
              voucher Generated:
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>
              {moment(data?.dataToApproved?.voucherGeneratedDate).format(
                "DD-MMM-YYYY"
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} wrap="wrap" mt={0.3} ml={4}>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>Payable Amount:</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>{data?.dataToApproved?.totalPayableAmount}</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>Created By:</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>
              {data?.dataToApproved?.log?.createdBy?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container wrap="wrap" mt={0.3}>
          <Grid item md={6} sm={6} xs={12}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              sx={{ width: "100%" }}
              size="small"
              className={styles.dateInp}
              locale="en"
              timeZone="Asia/Kolkata"
            >
              <DemoContainer
                components={["DatePicker"]}
                className={styles.dateInp}
              >
                <DemoItem>
                  <DatePicker
                    sx={{
                      "& .MuiInputBase-input": {
                        height: "9px",
                      },
                    }}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => {
                      return setApprovedData((prevState) => ({
                        ...prevState,
                        date: newValue.format(),
                      }));
                    }}
                    label="Transaction Date"
                  />
                </DemoItem>
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item md={6} sm={6} xs={12} mt={1}>
            <TextField
              size="small"
              id="transitionNumber"
              label="Transaction Number"
              name="transitionNumber"
              variant="outlined"
              sx={{ width: "100%" }}
              value={approvedData?.transitionNo || ""}
              onChange={(event) =>
                setApprovedData((prevState) => ({
                  ...prevState,
                  transitionNo: event.target.value,
                }))
              }
            />
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            mt={1}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <button
              className={styles["cancle-button"]}
              type="button"
              onClick={handleSubmitClick}
            >
              Submit
            </button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ApprovedModel;
