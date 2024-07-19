import React, { useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";

import { Card, CardContent, Grid, Typography, TextField } from "@mui/material";

import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

import instance from "../../../util/axios/config";
import styles from "./styles.module.css";

const CancelModel = ({
  closeModal,
  canceleData,
  setSubmittingResponses,
  sessionName,
}) => {
  const [cancelReason, setCanceleReason] = useState("");
  //   console.log(canceleData?.fetchedDataToCancle);

  const handleCancleClick = async () => {
    try {
      if (cancelReason) {
        const dataToCancle = canceleData?.dataToCancle;
        const currDate = dayjs();
        const cancelDate = currDate ? dayjs(currDate).format("YYYY-MM-DD") : "";

        const formData = {
          ...dataToCancle,
          cancelReason: cancelReason,
          cancelDate: cancelDate,
        };

        const response = await instance.put(
          `fee-record/cancle?search=${JSON.stringify({
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
        toast.error("Reason is required!", {
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
          You want to cancel this transaction
        </Typography>
        <Grid container spacing={1} wrap="wrap" mt={1} ml={4}>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>Receipt No:</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>{canceleData?.dataToCancle?.log?.receiptNo}</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>Payment Date:</Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>
              {moment(canceleData?.dataToCancle?.log?.date).format(
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
            <Typography>
              {canceleData?.dataToCancle?.log?.payableAmount}
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography sx={{ fontWeight: "bold" }}>
              Create/Approved By:
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={6}>
            <Typography>
              {canceleData?.dataToCancle?.log?.approvedBy?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1} wrap="wrap" mt={0.3}>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <TextField
              size="small"
              id="reason"
              label="Reason"
              name="reason"
              variant="outlined"
              value={cancelReason || ""}
              onChange={(event) => setCanceleReason(event.target.value)}
            />
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <button
              className={styles["cancle-button"]}
              type="button"
              onClick={handleCancleClick}
            >
              Submit
            </button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CancelModel;
