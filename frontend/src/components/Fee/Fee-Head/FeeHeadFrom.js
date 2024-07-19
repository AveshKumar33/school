import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControlLabel,
  TextField,
  Autocomplete,
} from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import { fetchData, postData } from "../../../redux/http-slice";
import Checkbox from "@mui/material/Checkbox";
import styles from "./FeeHeadForm.module.css";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

const months = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const FeeHeadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [checkedItems, setCheckedItems] = useState([]);
  const [allAccountName, setallAccountName] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [checked, setChecked] = React.useState(false);

  const handleHttpError = useHttpErrorHandler();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, httpError, Loading } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    if (Loading === false && data) {
      setallAccountName(data);
    }
    if (httpError?.status === 401 || httpError?.status === 500) {
      dispatch(authActions.logout());
    }
  }, [dispatch, Loading, httpError, data]);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        await dispatch(fetchData({ path: "/account/all" })).unwrap();
      } catch (error) {
        handleHttpError(error);
      }
    };

    fetchAccountData();
  }, [dispatch, handleHttpError]);

  const handleAccountChange = (event, value) => {
    setSelectedAccount(value);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleCheckboxChange = (label) => {
    setCheckedItems((prevState) => {
      if (prevState?.includes(label)) {
        return prevState?.filter((item) => item !== label);
      } else {
        return [...prevState, label];
      }
    });
  };

  const onSubmit = async (data) => {
    if (checkedItems.length === 0) {
      alert("Please Check duartion!");
      return;
    }

    const accountNameId = selectedAccount?._id;

    const feeHeadData = {
      name: data.name,
      paidMonth: checkedItems,
      accountNameId: accountNameId,
      newStudentOnly: checked,
    };

    try {
      await dispatch(
        postData({ path: "/fee-head", data: feeHeadData })
      ).unwrap();

      navigate("/fee/fee-head-list");
    } catch (error) {
      handleHttpError(error);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader subheader="Fee head form" title="Fee Head" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                id="outlined-basic"
                className={styles.textField}
                size="small"
                label="Name"
                variant="outlined"
                {...register("name", { required: true })}
              />
              {errors.name && <div>This field is required</div>}
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <Autocomplete
                id="highlights-demo"
                sx={{ width: "100%" }}
                size="small"
                style={{ width: "100%" }}
                options={allAccountName || []}
                getOptionLabel={(allAccountName) => allAccountName?.accountName}
                onChange={handleAccountChange}
                renderInput={(params) => (
                  <TextField {...params} label="Account Name" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.accountName, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.accountName, matches);

                  return (
                    <li {...props} key={option?._id}>
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
            <Grid item md={4} sm={6} xs={12}>
              <FormControlLabel
                label="Is only for new students"
                control={<Checkbox checked={checked} onChange={handleChange} />}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <label
                htmlFor="duration"
                className={styles["form-label"]}
                style={{ marginTop: "20px" }}
              >
                Duration
              </label>

              <div className={styles["check-box"]}>
                {months.map((month, index) => (
                  <FormControlLabel
                    key={index}
                    className={styles["check-box-item"]}
                    control={
                      <Checkbox
                        checked={checkedItems?.includes(month) ? true : false}
                        onChange={() => {
                          handleCheckboxChange(month);
                        }}
                      />
                    }
                    label={month}
                  />
                ))}
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <div className={styles["submit-button"]}>
            <button type="submit">Submit</button>
          </div>
        </div>
      </Card>
    </form>
  );
};

export default FeeHeadForm;
