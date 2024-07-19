import React from "react";

import { Grid, TextField, Autocomplete } from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import styles from "./styles.module.css";

const paymentModes = [
  { value: "Cash", label: "Cash" },
  { value: "Cheque", label: "Cheque" },
  { value: "Online", label: "Online" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
];

const PaymentMode = ({
  setSelectedData,
  setDate,
  selectedData,
  date,
  setPaymentData,
}) => {
  return (
    <>
      <Grid item md={3} sm={4} xs={12}>
        {/* <InputLabel>Session</InputLabel> */}
        <Autocomplete
          id="paymentModes"
          size="small"
          options={paymentModes || []}
          value={selectedData?.paymentMode || null}
          getOptionLabel={(option) => option?.value}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          onChange={(event, value) => {
            setSelectedData((prevState) => ({
              ...prevState,
              paymentMode: value,
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Payment Mode" />
          )}
          renderOption={(props, option, { inputValue }) => {
            const matches = match(option?.value, inputValue, {
              insideWords: true,
            });
            const parts = parse(option?.value, matches);

            return (
              <li {...props}>
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

      {/* Remark */}
      <Grid item md={3} sm={4} xs={12}>
        <TextField
          size="small"
          className={styles.textField}
          id="totalFee"
          name="total fee"
          variant="outlined"
          label="Remark"
          onChange={(event) => {
            setPaymentData((prevState) => ({
              ...prevState,
              remark: event.target.value,
            }));
          }}
        />
      </Grid>

      {/* Cheque Number */}
      {selectedData?.paymentMode?.value === "Cheque" && (
        <Grid item md={3} sm={4} xs={12}>
          <TextField
            size="small"
            className={styles.textField}
            id="ChequeNumber"
            name="total fee"
            variant="outlined"
            label="Cheque Number"
            onChange={(event) => {
              setPaymentData((prevState) => ({
                ...prevState,
                chequeNumber: event.target.value,
              }));
            }}
          />
        </Grid>
      )}

      {/* Transaction Number */}
      {(selectedData?.paymentMode?.value === "Debit Card" ||
        selectedData?.paymentMode?.value === "Online" ||
        selectedData?.paymentMode?.value === "Credit Card") && (
        <Grid item md={3} sm={4} xs={12}>
          <TextField
            size="small"
            className={styles.textField}
            id="transactionNumber"
            name="total fee"
            variant="outlined"
            label="Transaction Number"
            onChange={(event) => {
              setPaymentData((prevState) => ({
                ...prevState,
                transactionNumber: event.target.value,
              }));
            }}
            //   value={feeData?.fee || ""}
          />
        </Grid>
      )}

      {/* Cheque / Transaction Date */}
      {(selectedData?.paymentMode?.value === "Cheque" ||
        selectedData?.paymentMode?.value === "Online") && (
        <Grid item md={3} sm={4} xs={12}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            fullWidth
            size="small"
            locale="en"
            timeZone="Asia/Kolkata"
          >
            <DemoContainer
              components={["DatePicker"]}
              sx={{ width: "100%", mt: -0.9 }}
            >
              <DemoItem>
                <DatePicker
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-input": {
                      height: "8px",
                    },
                  }}
                  value={date?.Cheque_Transaction_Date}
                  format="DD/MM/YYYY"
                  onChange={(newValue) =>
                    setDate((prevState) => ({
                      ...prevState,
                      Cheque_Transaction_Date: newValue.format(),
                    }))
                  }
                  label="Cheque/Transaction Date"
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
      )}

      {/* Invoice Number */}
      {selectedData?.paymentMode?.value === "Credit Card" && (
        <Grid item md={3} sm={4} xs={12}>
          <TextField
            size="small"
            className={styles.textField}
            id="totalFee"
            name="total fee"
            variant="outlined"
            label="Invoice Number"
            onChange={(event) => {
              setPaymentData((prevState) => ({
                ...prevState,
                invoiceNumber: event.target.value,
              }));
            }}
            //   value={feeData?.fee || ""}
          />
        </Grid>
      )}

      {/* Batch Number */}
      {selectedData?.paymentMode?.value === "Credit Card" && (
        <Grid item md={3} sm={4} xs={12}>
          <TextField
            size="small"
            className={styles.textField}
            id="batchFee"
            name="total fee"
            variant="outlined"
            label="Batch Number"
            onChange={(event) => {
              setPaymentData((prevState) => ({
                ...prevState,
                batchNumber: event.target.value,
              }));
            }}
            //   value={feeData?.fee || ""}
          />
        </Grid>
      )}
    </>
  );
};

export default PaymentMode;
