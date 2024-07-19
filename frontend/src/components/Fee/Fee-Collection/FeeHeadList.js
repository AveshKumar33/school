import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

import {
  TableCell,
  TableRow,
  TextField,
  Collapse,
  Box,
  Typography,
  Table,
  TableHead,
  Backdrop,
  Modal,
  Fade,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import instance from "../../../util/axios/config";
import classes from "./styles.module.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "background.paper",
  border: "2px solid #4977f8",
  boxShadow: 10,
  p: 0,
};

const FeeHeadList = ({
  feeData = {},
  updateFeeData,
  setSubmittingResponses,
  sessionName,
}) => {
  const [open, setOpen] = useState(false);

  const [fee, setFee] = useState({
    fee: 0,
    totalCurrentPayableAmount: 0,
    payableAmount: 0,
    currentBalance: 0,
  });

  const [feeDataForDiscount, setFeeDataForDiscount] = useState(null);
  const [discountConfigModel, setDiscountConfigModel] = React.useState(false);
  const [discountData, setDiscountData] = useState({
    amount: 0,
    reason: "",
  });
  const [error, setError] = useState({
    amountError: false,
    reasonError: false,
  });
  const handleModelOpenClose = () => {
    setDiscountConfigModel(false);
    setFeeDataForDiscount(null);
  };

  useEffect(() => {
    // console.log("feeData", feeData);
    setFee((prevState) => ({
      ...prevState,
      fee: Number(feeData?.fee),
      totalCurrentPayableAmount: Number(feeData.remainingAmount),
      payableAmount: Number(feeData.payableAmount),
      currentBalance:
        Number(feeData.remainingAmount) - Number(feeData.payableAmount),
    }));
  }, [feeData]);

  useEffect(() => {
    if (feeDataForDiscount) {
      setDiscountConfigModel(true);
    }
  }, [feeDataForDiscount]);

  const handleDiscountSubmit = async () => {
    if (!discountData?.reason) {
      setError((prevState) => ({ ...prevState, reasonError: true }));
      return;
    }

    if (!discountData?.amount) {
      setError((prevState) => ({ ...prevState, amountError: true }));
      return;
    }

    if (discountData?.amount > feeDataForDiscount?.remainingAmount) {
      toast.error("Discount amount can't be greater than submitting amount", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    const formData = {
      id: feeDataForDiscount?.id,
      discountAmount: discountData?.amount,
      discountReason: discountData?.reason,
    };

    try {
      const response = await instance.put(
        `/fee-record/configure-discount?search=${JSON.stringify({
          session: sessionName,
        })}`,
        formData
      );

      if (response?.data?.status === "Success") {
        setSubmittingResponses(response?.data?.data);
        setDiscountConfigModel(false);
        toast.success(response?.data?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
      setDiscountData({ amount: 0, reason: "" });
    } catch (error) {
      setDiscountConfigModel(false);
      setDiscountData({ amount: 0, reason: "" });
      toast.success(error?.response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={discountConfigModel}
        onClose={handleModelOpenClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={discountConfigModel}>
          <Card sx={style}>
            <CardContent>
              <Grid container spacing={2} wrap="wrap">
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    size="small"
                    error={error.reasonError}
                    className={classes.textField}
                    id="discountConfiguration"
                    name="ReasonforDiscount"
                    label="Reason for Discount"
                    type="text"
                    variant="outlined"
                    helperText={error?.reasonError ? "field is required" : ""}
                    value={discountData?.reason || ""}
                    onChange={(event) => {
                      setDiscountData((prevState) => ({
                        ...prevState,
                        reason: event.target.value,
                      }));

                      setError((prevState) => ({
                        ...prevState,
                        reasonError: false,
                      }));
                    }}
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <TextField
                    size="small"
                    error={error.amountError}
                    className={classes.textField}
                    id="discountAmtConfiguration"
                    type="number"
                    name="DiscountAmount"
                    label="Discount Amount"
                    variant="outlined"
                    value={discountData?.amount}
                    helperText={error?.amountError ? "field is required" : ""}
                    onChange={(event) => {
                      setDiscountData((prevState) => ({
                        ...prevState,
                        amount: event.target.value,
                      }));

                      setError((prevState) => ({
                        ...prevState,
                        amountError: false,
                      }));
                    }}
                  />
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <Button variant="contained" onClick={handleDiscountSubmit}>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Fade>
      </Modal>

      <TableRow hover>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{`${feeData?.name}(${feeData?.month})`}</TableCell>
        <TableCell>N/A</TableCell>
        <TableCell>
          <TextField
            size="small"
            className={classes.textField}
            sx={{ backgroundColor: "#f5f5f5" }}
            id="totalFee"
            name="total fee"
            variant="outlined"
            value={feeData?.fee || ""}
            disabled={true}
          />
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            className={classes.textField}
            sx={{ backgroundColor: "#f5f5f5", marginTop: "17px" }}
            id="totalFee"
            name="discount fee"
            variant="outlined"
            value={feeData?.totalDiscount || 0}
            disabled={true}
          />
          <div
            onClick={() => {
              setFeeDataForDiscount(feeData);
            }}
            className={classes.discountText}
          >
            Configure Discount
          </div>
        </TableCell>
        <TableCell>
          <TextField
            error={fee?.fee < fee?.payableAmount ? true : false}
            size="small"
            className={classes.textField}
            sx={{ backgroundColor: "#f5f5f5" }}
            id="totalFee"
            name="discount fee"
            variant="outlined"
            value={fee.payableAmount || 0}
            onChange={(event) => {
              setFee((prevState) => ({
                ...prevState,
                payableAmount: event.target.value,
              }));
              updateFeeData({
                id: feeData.id,
                payableAmount: event.target.value,
                currentBalance:
                  fee?.totalCurrentPayableAmount - [event.target.value],
              });
            }}
          />
        </TableCell>
        <TableCell>
          <TextField
            size="small"
            className={classes.textField}
            sx={{ backgroundColor: "#f5f5f5" }}
            // id={`${student?._id}_${item?.paperId}_obtainGrade`}
            id="totalFee"
            // label="Description"
            name="Sumbitting Amount"
            variant="outlined"
            value={fee?.currentBalance || 0}
            disabled={true}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="payment history">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Paid Amount</TableCell>
                    <TableCell>Remaining Amount</TableCell>
                  </TableRow>

                  {feeData?.data?.length > 0 ? (
                    feeData.data.map((data) => (
                      <TableRow key={data?._id}>
                        <TableCell>
                          {moment(data?.date).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell>{feeData?.fee}</TableCell>
                        <TableCell>{data?.payableAmount}</TableCell>
                        <TableCell>{data?.remainingAmount}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableHead>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default FeeHeadList;
