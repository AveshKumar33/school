import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";

import {
  Box,
  Grid,
  Paper,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Autocomplete,
} from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import axios from "../../../util/axios/config";
import styles from "./FeeStructureForm.module.css";
import FeeInput from "./FeeInput";
import { toast } from "react-toastify";

const FeeStructureForm = ({ value = {}, method = "post" }) => {
  const [feeDetails, setFeeDetails] = useState([]);
  const [standard, setStandard] = useState([]);
  const [section, setSection] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [inputList, setInputList] = useState([
    {
      name: null,
      amount: "",
      duration: "",
    },
  ]);

  const dispatch = useDispatch();
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
      if ([401, 500].includes(error?.response?.data?.status)) {
        toast.error("Please logiin again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        dispatch(authActions.logout());
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  useEffect(() => {
    getFeeDetals();
    getStandard();
  }, []);

  useEffect(() => {
    if (selectedStandard) {
      const sectionData = selectedStandard?.sections;

      const allSectionData = sectionData?.map((item) => ({
        label: item.section,
        value: item._id,
      }));

      setSection(allSectionData);
    }
  }, [selectedStandard]);

  const postFeeData = async (data) => {
    let response = "";
    try {
      if (method === "put") {
        response = await axios.put("/feestructure/" + params.id, data);
      } else {
        response = await axios.post("/feestructure", data);
      }

      toast.success(response?.data?.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      navigate("/fee/fee-structure-list");
    } catch (error) {
      if ([401, 500].includes(error?.response?.data?.status)) {
        dispatch(authActions.logout());
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  useEffect(() => {
    if (inputList.length > 0) {
      inputList[inputList?.length - 1].name === null ||
      inputList[inputList?.length - 1].amount === ""
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  }, [inputList]);

  const handleListAdd = () => {
    setInputList((prevInputList) => [
      ...prevInputList,
      {
        name: null,
        amount: "",
        duration: "",
      },
    ]);
  };

  const handleStandardChange = (event, value) => {
    setSection([]);
    setSelectedSection([]);
    setSelectedStandard(value);
  };

  const { name, standard: standarData } = value;

  useEffect(() => {
    const getData = name?.map((data) => ({
      name: data?.name,
      amount: data?.amount,
      duration: data?.name?.paidMonth,
    }));

    const allSectionData = value?.section?.map((item) => ({
      label: item.section,
      value: item._id,
    }));

    setSelectedStandard(standarData);
    setSelectedSection(allSectionData);

    if (getData?.length > 0) {
      setInputList((prevData) => {
        return [...getData];
      });
    }
  }, [name, standarData]);

  const handleInputChange = (event, index, newValue, field = "amount") => {
    const newInputList = [...inputList];
    if (field === "amount") {
      newInputList[index][field] = event.target.value;
    } else {
      newInputList[index][field] = newValue;
      newInputList[index]["duration"] = newValue?.paidMonth;
    }
    setInputList(newInputList);
  };

  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    const formatData = inputList?.map((item) => ({
      name: item.name?._id,
      amount: item?.amount,
    }));
    setFormattedData(formatData);
  }, [inputList]);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedStandard ||
      !selectedSection?.length > 0 ||
      !formattedData[formattedData?.length - 1]?.name ||
      !formattedData[formattedData?.length - 1]?.amount
    ) {
      toast.error("All fields are required!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    let postData = {
      name: formattedData,
      standard: selectedStandard?._id,
      section: getId(selectedSection),
    };

    postFeeData(postData);
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["container"]}
      style={{ minHeight: "80vh" }}
    >
      <Paper>
        <CardHeader
          title="Fee Structure Mapping"
          subheader="Standard Section fee mapping"
          className={styles.customCardHeader}
          classes={{
            subheader: styles.customSubheader,
            title: styles.customTitle,
          }}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={6} xs={12}>
              <label htmlFor="country" className={styles["form-label"]}>
                Standard
              </label>
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
                onChange={handleStandardChange}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Standard" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12} style={{ zIndex: 199 }}>
              <label className={styles["form-label"]}>Section</label>
              <MultiSelect
                options={section || []}
                value={selectedSection || []}
                onChange={(value) => {
                  setSelectedSection(value);
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
          </Grid>
          <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
            <div>
              {inputList.map((input, index) => (
                <FeeInput
                  key={index}
                  index={index}
                  value={input}
                  feeDetails={feeDetails}
                  onInputChange={handleInputChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
            <div
              className={styles["submit-button"]}
              style={{ marginTop: "30px" }}
            >
              <button
                type="button"
                className={isDisabled ? styles.disabled : ""}
                disabled={isDisabled}
                onClick={handleListAdd}
              >
                Add More
              </button>
            </div>
          </div>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={1}
          className={styles["submit-button"]}
        >
          <button type="submit">Submit</button>
        </Box>
      </Paper>
    </form>
  );
};

export default FeeStructureForm;
