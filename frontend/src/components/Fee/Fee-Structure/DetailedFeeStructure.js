import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../util/axios/config";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import styles from "./FeeStructureForm.module.css";
import FeeInput from "./FeeInput";

const DetailedFeeStructureForm = ({ value = {} }) => {
  const [feeDetails, setFeeDetails] = useState([]);
  const [standard, setStandard] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [amount, setAmount] = useState(null);
  const [duration, setDuration] = useState("");
  const [isDisabled, setIsDisabled] = useState({ btn: true, inp: true });
  const [inputList, setInputList] = useState([
    {
      name: "",
      amount: "",
      duration: "",
    },
  ]);

  const params = useParams();
  const navigate = useNavigate();

  const getFeeDetals = async () => {
    try {
      const response = await axios.get(`/fee-head/all`);
      setFeeDetails(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStandard = async () => {
    try {
      const response = await axios.get(`/standard`);
      setStandard(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeeDetals();
    getStandard();
  }, []);

  const postFeeData = async (data) => {
    try {
      const response = await axios.put("/feestructure/" + params.id, data);

      if (response.data.status === "failed") {
        return response;
      }

      window.alert(response.data.message);

      navigate("/fee-structure-list");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleListAdd = () => {
    setInputList((prevInputList) => [
      ...prevInputList,
      {
        name: selectedOptions,
        amount: amount,
        duration: selectedOptions.paidMonth,
      },
    ]);
  };

  //   console.log(value.name);
  //   console.log(value.duration);

  // useEffect(() => {
  //   const getData = value?.name.map((data) => ({
  //     name: data.name,
  //     amount: data.amount,
  //     duration: data.name.paidMonth,
  //   }));

  //   setSelectedStandard(value.standard);
  //   setInputList((prevData) => {
  //     return [
  //       {
  //         name: "",
  //         amount: "",
  //         duration: "",
  //       },

  //       ...getData,
  //     ];
  //   });
  // }, []);

  useEffect(() => {
    if (selectedOptions !== null && amount !== null) {
      setIsDisabled((prevState) => ({ ...prevState, btn: false }));
    }
  }, [selectedOptions, amount]);

  const handleAmountChange = (event) => {
    setAmount(event);
  };

  const handleNameChange = (newValue) => {
    setSelectedOptions(newValue);
  };

  useEffect(() => {
    setDuration(selectedOptions?.paidMonth);
  }, [selectedOptions]);

  const handleStandardChange = (event, value) => {
    setSelectedStandard(value);
  };

  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    const formatData = inputList.slice(1).map((item) => ({
      name: item.name._id,
      amount: item.amount,
    }));

    setFormattedData(formatData);
  }, [inputList]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStandard === null) {
      alert("Please Select Standard!");
      return;
    } else if (formattedData.length === 0) {
      alert("Please Select Name and amount!");
      return;
    }

    const postData = {
      name: formattedData,
      standard: selectedStandard._id,
    };

    console.log(postData);

    postFeeData(postData);
  };

  let sliceInput = isDisabled.inp ? 1 : 0;

  const handleClick = () => {
    setIsDisabled((prevState) => ({ ...prevState, inp: false }));
  };

  return (
    <div className={styles["form-container"]}>
      <h1>Fee Stucture</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="country" className={styles["form-label"]}>
              Standard
            </label>
            <Stack sx={{ width: 320 }}>
              <Autocomplete
                //   multiple
                //   disableCloseOnSelect
                name="standard"
                size="small"
                id="tags-outlined"
                options={standard}
                value={selectedStandard}
                disabled={isDisabled.inp}
                isOptionEqualToValue={(option, value) =>
                  option.standard === value.standard
                }
                getOptionLabel={(option) => option.standard}
                filterSelectedOptions
                onChange={handleStandardChange}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Standard" />
                )}
              />
            </Stack>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              {inputList.length > 0 &&
                inputList
                  .slice(sliceInput)
                  .map((input, index) => (
                    <FeeInput
                      key={index}
                      feeDetails={feeDetails}
                      value={input}
                      duration={duration}
                      onNameChange={handleNameChange}
                      selectedOptions={selectedOptions}
                      onAmountChange={handleAmountChange}
                      isDisabled={isDisabled}
                    />
                  ))}
            </div>
            <div
              className={styles["submit-button"]}
              style={{ marginTop: "30px" }}
            >
              <button
                type="button"
                className={isDisabled.btn ? styles.disabled : ""}
                disabled={isDisabled}
                onClick={handleListAdd}
              >
                Add More
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className={styles["submit-button"]}>
            <button
              type="submit"
              className={
                isDisabled.btn && isDisabled.inp ? styles.disabled : ""
              }
            >
              Submit
            </button>
            <button
              style={{ backgroundColor: "#20b262", marginLeft: "10px" }}
              type="button"
              onClick={handleClick}
            >
              Edit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DetailedFeeStructureForm;
