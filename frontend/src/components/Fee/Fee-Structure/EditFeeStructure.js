import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../../util/axios/config";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import styles from "./FeeStructureForm.module.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import FeeInput, { FeeInputList } from "./FeeInput";

const EditFeeStructureForm = ({ value }) => {
  const [feeDetails, setFeeDetails] = useState([]);
  const [standard, setStandard] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  // const [isDisabled, setIsDsabled] = useState(false);
  // const [value, setValue] = useState();
  const [inputList, setInputList] = useState([]);

  const navigate = useNavigate();
  const params = useParams();

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
      navigate("/fee/fee-structure-list");
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const { name, standard: standarData } = value;

  useEffect(() => {
    const getData = name.map((data) => ({
      name: data.name,
      amount: data.amount,
      duration: data.name.paidMonth,
    }));

    setSelectedStandard(standarData);
    setInputList((prevData) => {
      return [...getData];
    });
  }, [name, standarData]);

  const handleListAdd = () => {
    setInputList((prevInputList) => [
      ...prevInputList,
      {
        name: selectedOptions,
        amount: amount,
        duration: selectedOptions.paidMonth,
      },
    ]);

    setAmount("");
    setSelectedOptions("");
  };

  useEffect(() => {
    setDuration(selectedOptions?.paidMonth);
  }, [selectedOptions]);

  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    const formatData = inputList?.map((item) => ({
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

  const deleteHandler = (index) => {
    const updatedInputList = inputList;
    updatedInputList.splice(index, 1);

    setInputList([...updatedInputList]);
  };

  const editHandler = (inputValue, index) => {
    setSelectedOptions(inputValue.name);
    setAmount(inputValue.amount);

    const updatedInputList = inputList;
    updatedInputList.splice(index, 1);

    setInputList([...updatedInputList]);
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
                value={selectedStandard || null}
                isOptionEqualToValue={(option, value) =>
                  option._id === value._id
                }
                getOptionLabel={(option) => option.standard}
                filterSelectedOptions
                onChange={(event, newValue) => setSelectedStandard(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Standard" />
                )}
              />
            </Stack>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>
              <FeeInput
                feeDetails={feeDetails}
                // value={input}
                duration={duration}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                amount={amount}
                setAmount={setAmount}
              />
              {inputList.length > 0 &&
                inputList.map((input, index) => (
                  <div key={index} style={{ display: "flex" }}>
                    <FeeInputList
                      feeDetails={feeDetails}
                      value={input}
                      duration={duration}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteHandler(index)}
                    >
                      <DeleteIcon className={styles["delete-button"]} />
                    </IconButton>
                    <IconButton onClick={() => editHandler(input, index)}>
                      <BorderColorIcon />
                    </IconButton>
                  </div>
                ))}
            </div>
            <div
              className={styles["submit-button"]}
              style={{ marginTop: "30px" }}
            >
              <button
                type="button"
                // className={isDisabled ? styles.disabled : ""}
                onClick={handleListAdd}
              >
                Add More
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div className={styles["submit-button"]}>
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditFeeStructureForm;
