import React, { useState, useEffect } from "react";

import { TableCell, TableRow, TextField } from "@mui/material";

import classes from "./styles.module.css";

const FeeRecordList = ({ feeRecordData = {}, updateFeeData }) => {
  const [feeData, setFeeData] = useState();

  useEffect(() => {
    setFeeData((prevState) => ({ ...prevState, ...feeRecordData }));
  }, [feeRecordData]);

  return (
    <TableRow>
      <TableCell>{feeData?._id?.feeHead?.name}</TableCell>
      {feeData?.records.map((feeRecord, index) => (
        <TableCell key={index} style={{ padding: "0px 1px 5px 1px" }}>
          <TextField
            size="small"
            className={classes.textField}
            sx={{ backgroundColor: "#f5f5f5" }}
            name="total fee"
            margin="dense"
            variant="outlined"
            disabled={true}
            value={feeRecord?.remainingAmount || 0}
          />
          <TextField
            size="small"
            className={classes.textField}
            id={`${feeRecord?.feeHead}_${feeRecord?.month}`}
            name="total fee"
            variant="outlined"
            value={feeRecord?.incrementedAmount || 0}
            onChange={(event) => {
              setFeeData((prevState) => {
                const updatedRecords = prevState.records.map((record) => {
                  if (
                    record?.month === feeRecord?.month &&
                    record?.feeHead === feeRecord?.feeHead
                  ) {
                    return {
                      ...record,
                      incrementedAmount: Number(event.target.value),
                    };
                  }
                  return record;
                });

                return { ...prevState, records: updatedRecords };
              });

              updateFeeData({
                feeHead: feeRecord?.feeHead,
                incrementedAmount: Number(event.target.value),
                month: feeRecord?.month,
              });
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default FeeRecordList;
