import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

import {
  Divider,
  Paper,
  Grid,
  CardContent,
  CardHeader,
  Button,
  Box,
  TextField,
  Autocomplete,
  InputLabel,
  Typography,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import instance from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import Modal from "../UI/Modal";
import styles from "./styles.module.css";
// import studentFeeRecords from "./feeRecordData(2023-2024)";
import studentFeeRecords from "./FeeRecordRegFee(2023-2024)";

const FeeRecordImport = () => {
  const initialState = {
    session: [],
    Standard: [],
    section: [],
    students: [],
    prevFeeRecord: [],
    feeStructureData: null,
  };

  const [data, setData] = useState(initialState);

  const initialSelectedData = {
    session: null,
    Standard: null,
    section: null,
    student: [],
  };

  const [selectedData, setSelectedData] = useState(initialSelectedData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState({
    session: "",
    Standard: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedData?.Standard) {
      const sectionData = selectedData?.Standard?.sections;
      setData((prevState) => ({ ...prevState, section: sectionData }));
    }
  }, [selectedData?.Standard]);

  // fetch session
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        setData((prevData) => ({
          ...prevData,
          session: sessionResp?.data?.data,
        }));
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(
            error?.response?.data?.message || "Something went wrong",
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };
    fetchData();
  }, [dispatch]);

  // fetch (from section data) standrd sectiom
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardResp = await instance.get(
          "/standard/all?search=" +
            JSON.stringify({ session: selectedData?.session?.name })
        );

        setData((prevData) => ({
          ...prevData,
          Standard: standardResp?.data?.data,
        }));
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(
            error?.response?.data?.message || "Something went wrong",
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };

    if (selectedData?.session) {
      fetchData();
    }
  }, [dispatch, selectedData?.session]);

  // fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardId = selectedData?.Standard?._id;
        const sectionId = selectedData?.section?._id;
        const filterData = {
          session: selectedData?.session?.name,
          standard: standardId,
          section: sectionId,
        };

        const response = await instance.get(
          "/student/name?search=" + JSON.stringify(filterData)
        );

        const students = response.data.data;
        const allData = students?.map((student) => ({
          label: `${student?.firstName} ${student?.middleName} ${student?.lastName} (${student?.fatherName})`,
          value: student?._id,
        }));

        setData((prevData) => ({
          ...prevData,
          students: allData,
        }));
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          toast.error("Please login again!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
          dispatch(authActions.logout());
        } else {
          toast.error(
            error?.response?.data?.message || "Something went wrong",
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              theme: "colored",
            }
          );
        }
      }
    };

    if (
      selectedData?.Standard &&
      selectedData?.section &&
      selectedData?.session
    ) {
      fetchData();
    }
  }, [
    dispatch,
    selectedData?.Standard,
    selectedData?.section,
    selectedData?.session,
  ]);

  // const getId = (arr) => {
  //   return arr?.map((item) => item?.value);
  // };

  // fetch student fee records
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const standardId = selectedData?.Standard?._id;
  //       const sectionId = selectedData?.section?._id;
  //       const filterData = {
  //         session: selectedData?.session?.name,
  //         standard: standardId,
  //         section: sectionId,
  //         student: getId(selectedData?.student),
  //       };

  //       const response = await instance.get(
  //         "/fee-record/all/group/api?search=" + JSON.stringify(filterData)
  //       );

  //       const feeRecords = response.data.data;

  //     } catch (error) {
  //       if (
  //         error?.response?.data?.status === 401 ||
  //         error?.response?.data?.status === 500
  //       ) {
  //         toast.error("Please login again!", {
  //           position: toast.POSITION.BOTTOM_CENTER,
  //           autoClose: 2000,
  //           hideProgressBar: true,
  //           theme: "colored",
  //         });
  //         dispatch(authActions.logout());
  //       } else {
  //         toast.error(
  //           error?.response?.data?.message || "Something went wrong",
  //           {
  //             position: toast.POSITION.BOTTOM_CENTER,
  //             autoClose: 2000,
  //             hideProgressBar: true,
  //             theme: "colored",
  //           }
  //         );
  //       }
  //     }
  //   };

  //   if (
  //     selectedData?.Standard &&
  //     selectedData?.section &&
  //     selectedData?.session &&
  //     selectedData?.student?.length > 0
  //   ) {
  //     fetchData();
  //   }
  // }, [
  //   dispatch,
  //   selectedData?.Standard,
  //   selectedData?.section,
  //   selectedData?.session,
  //   selectedData?.student,
  // ]);

  const validate = () => {
    if (!selectedData?.session) {
      setError((prevState) => ({
        ...prevState,
        session: "Please select from session",
        Standard: "",
        section: "",
      }));
      return false;
    }
    if (!selectedData?.Standard) {
      setError((prevState) => ({
        ...prevState,
        session: "",
        Standard: "Please select from standard",
        section: "",
      }));
      return false;
    }
    if (!selectedData?.section) {
      setError((prevState) => ({
        ...prevState,
        session: "",
        Standard: "",
        section: "Please select from section",
      }));
      return false;
    }
    return true;
  };

  const onMigrateBtnClick = async () => {
    setIsModalOpen(true);
  };

  const handleConfirmMigrateHandler = async () => {
    setIsModalOpen(false);

    try {
      if (!validate()) {
        return;
      }

      setLoading(true);

      if (selectedData?.student?.length === 0) {
        toast.error("Please select student!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        setLoading(false);
        return;
      }

      let studentsFiltededata = [];
      for (let studentData of selectedData.student) {
        const filtededata = studentFeeRecords.filter(
          (student) => student.Studentid === studentData.value
        );

        studentsFiltededata.push(...filtededata);
      }

      const formattedDate = (date) => {
        if (date) {
          const newDate = date.toString();
          return `${newDate.slice(6, 8)}-${newDate.slice(4, 6)}-${newDate.slice(
            0,
            4
          )}`;
        } else {
          return "";
        }
      };

      const formData = studentsFiltededata.map((feeData) => {
        const {
          Studentid,
          ClassId,
          StreamId,
          Feehead,
          Amount,
          VNo,
          Month,
          BankPaymentDate,
          TransactionNo,
          GeneratedDate,
          PostDate,
          isCancel,
          CancelDate,
          CancelRemark,
        } = feeData;

        return {
          student: Studentid,
          standard: ClassId,
          section: StreamId,
          feeHead: Feehead,
          month: Month,
          payableAmount: Amount,
          isCancel: isCancel,
          cancelDate: formattedDate(CancelDate),
          cancelReason: CancelRemark,
          receiptNo: VNo,
          log: {
            receiptNo: VNo,
            createdBy: "651402b59e296045130b5e5e",
            payableAmount: Amount,
            date: formattedDate(BankPaymentDate),
            transactionDate: formattedDate(BankPaymentDate),
            voucherGeneratedDate: formattedDate(GeneratedDate),
            transactionNumber: TransactionNo,
            paymentMode: "Bank",
            isApproved: true,
            approvedBy: "651402b59e296045130b5e5e",
            approvedDate: formattedDate(PostDate),
            isBankPaid: true,
            isCancel: isCancel,
            cancelDate: formattedDate(CancelDate),
            cancelReason: CancelRemark,
          },
        };
      });

      const response = await instance.put(
        "/fee-record/import?search=" +
          JSON.stringify({ session: selectedData?.session?.name }),
        formData
      );

      if (response?.data?.status === "Success") {
        toast.success(response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Import!
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to import students!
            </p>
            <button
              className={styles["submit-btn"]}
              onClick={handleConfirmMigrateHandler}
            >
              Import
            </button>
            <button
              className={styles["cancle-button"]}
              type="button"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
      <div
        style={{
          width: "100%",
          marginTop: "15px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <div>
          <Button variant="contained" color="warning">
            <Link
              to="/student/fee/fee-import/discount"
              style={{ color: "#ffffff" }}
            >
              IMPORT DISCOUNT
            </Link>
          </Button>
        </div>
        <div className={styles["btn-container"]}>
          <Button variant="contained" color="info">
            <Link
              to="/student/fee/fee-import/panelty"
              style={{ color: "#ffffff" }}
            >
              IMPORT PANELTY
            </Link>
          </Button>
        </div>
      </div>
      <Grid className={styles.container} style={{ minHeight: "88vh" }}>
        <Paper style={{ zIndex: 1 }}>
          <CardHeader
            className={styles.customCardHeader}
            classes={{
              title: styles.customSubheader,
              subheader: styles.customTitle,
            }}
            title="Student Fee Records Import"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={4} sm={6} xs={12}>
                <InputLabel>Session</InputLabel>
                <Autocomplete
                  id="sessions"
                  size="small"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.session || []}
                  value={selectedData?.session || null}
                  getOptionLabel={(sessions) => sessions?.name}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      session: value,
                      Standard: null,
                      section: null,
                      student: [],
                    }));

                    setData((prevState) => ({
                      ...prevState,
                      Standard: [],
                      section: [],
                      students: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Session"
                      error={error.session ? true : false}
                      helperText={error.session ? error.session : ""}
                    />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.name, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.name, matches);

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

              {/* select standatd */}
              <Grid item md={4} sm={6} xs={12}>
                <InputLabel>Standard</InputLabel>
                <Autocomplete
                  id="standard"
                  size="small"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.Standard || []}
                  value={selectedData?.Standard || null}
                  getOptionLabel={(options) => options?.standard}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      Standard: value,
                    }));

                    setSelectedData((prevState) => ({
                      ...prevState,
                      section: null,
                      student: [],
                    }));
                    setData((prevState) => ({
                      ...prevState,
                      section: [],
                      students: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Standard"
                      error={error.Standard ? true : false}
                      helperText={error.Standard ? error.Standard : ""}
                    />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.standard, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.standard, matches);

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

              {/* select section */}
              <Grid item md={4} sm={6} xs={12}>
                <InputLabel>Section</InputLabel>
                <Autocomplete
                  id="section"
                  size="small"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={data?.section || []}
                  value={selectedData?.section || null}
                  getOptionLabel={(option) => option?.section}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      section: value,
                    }));

                    setSelectedData((prevState) => ({
                      ...prevState,
                      student: [],
                    }));

                    setData((prevState) => ({
                      ...prevState,
                      students: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Section"
                      error={error.section ? true : false}
                      helperText={error.section ? error.section : ""}
                    />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.section, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.section, matches);

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
              {/* select Student */}
              <Grid item md={4} sm={6} xs={12} style={{ zIndex: 100 }}>
                <InputLabel>Students</InputLabel>
                <MultiSelect
                  options={data?.students}
                  value={selectedData?.student}
                  onChange={(value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      student: value,
                    }));
                  }}
                  labelledBy={"Select User Type"}
                  isCreatable={false}
                  disableSearch={false}
                />
              </Grid>
            </Grid>
          </CardContent>

          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <LoadingButton
              endIcon={<></>}
              color="warning"
              type="submit"
              loading={loading}
              loadingPosition="end"
              variant="contained"
              onClick={onMigrateBtnClick}
            >
              <span>Import &nbsp;&nbsp;&nbsp;&nbsp;</span>
            </LoadingButton>
          </Box>
        </Paper>
      </Grid>
    </>
  );
};

export default FeeRecordImport;
