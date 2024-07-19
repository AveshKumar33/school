import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

import {
  Divider,
  Paper,
  Grid,
  CardContent,
  CardHeader,
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
import studentsData from "./GRADE-11-PCM";
import styles from "./styles.module.css";

const StudentImport = () => {
  const initialState = {
    fromSession: [],
    toSession: [],
    fromStandard: [],
    toStandard: [],
    fromSection: [],
    toSection: [],
    feeDiscount: [],
    students: [],
    prevFeeRecord: [],
    feeStructureData: null,
  };

  const [data, setData] = useState(initialState);

  const initialSelectedData = {
    fromSession: null,
    toSession: null,
    fromStandard: null,
    toStandard: null,
    fromSection: null,
    toSection: null,
    feeDiscount: [],
    student: [],
  };

  const [selectedData, setSelectedData] = useState(initialSelectedData);
  const [savedStudentsResponse, setSavedStudentsResponse] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postAPIResponse, setPostAPIResponse] = useState({
    postStudentResponse: null,
    postFeeRecordResponse: [],
  });
  const [error, setError] = useState({
    fromSession: "",
    toSession: "",
    fromStandard: "",
    toStandard: "",
    fromSection: "",
    toSection: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  console.log(studentsData.length);

  useEffect(() => {
    if (selectedData?.fromStandard) {
      const sectionData = selectedData?.fromStandard?.sections;
      setData((prevState) => ({ ...prevState, fromSection: sectionData }));
    }

    if (selectedData?.toStandard) {
      const sectionData = selectedData?.toStandard?.sections;
      setData((prevState) => ({ ...prevState, toSection: sectionData }));
    }
  }, [selectedData?.fromStandard, selectedData?.toStandard]);

  // fetch session
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        setData((prevData) => ({
          ...prevData,
          fromSession: sessionResp?.data?.data,
          toSession: sessionResp?.data?.data,
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
            JSON.stringify({ session: selectedData?.fromSession?.name })
        );

        setData((prevData) => ({
          ...prevData,
          fromStandard: standardResp?.data?.data,
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

    if (selectedData?.fromSession) {
      fetchData();
    }
  }, [dispatch, selectedData?.fromSession]);

  // fetch (to section data) standrd section and fee discount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [standardResp, feeDiscount] = await Promise.all([
          instance.get(
            "/standard/all?search=" +
              JSON.stringify({ session: selectedData?.toSession?.name })
          ),
          instance.get(
            `/fee-discount/all?search=${JSON.stringify({
              session: selectedData?.toSession?.name,
            })}`
          ),
        ]);

        const allData = feeDiscount?.data?.data?.map((item) => ({
          label: `${item?.discountName} (${item?.feeHeadDetails?.name})`,
          value: {
            discountId: item?._id,
            feeHead: item?.feeHeadDetails?._id,
            discountValue: item?.discountValue,
            discountMode: item?.discountMode,
          },
        }));

        setData((prevData) => ({
          ...prevData,
          toStandard: standardResp?.data?.data,
          feeDiscount: allData,
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

    if (selectedData?.toSession) {
      fetchData();
    }
  }, [dispatch, selectedData?.toSession]);

  // fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const standardId = selectedData?.fromStandard?._id;
        const sectionId = selectedData?.fromSection?._id;

        // const students = studentsData.filter((student) => {
        //   return (
        //     student.classID === standardId && student.sectionID === sectionId
        //   );
        // });

        const processedData = [];

        for (let student of studentsData) {
          const [firstName, ...otherNames] = student?.Name.split(" ");
          const lastName = otherNames.pop() || "";
          const middleName = otherNames.join(" ");

          processedData.push({
            session: student.sessionID,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            fatherName: student?.FatherName || "",
            stuMobileNo: student?.MobileNo,
            parentMobileNo: student?.MobileNo,
            rollNo: student?.RollNo,
            standard: student?.CourseId,
            section: student?.StreamId,
            admissionDate: student?.admissionDate,
            registrationDate: student?.registrationDate,
          });
        }

        const allData = processedData?.map((student) => ({
          label: `${student?.firstName} ${student?.middleName} ${student?.lastName} (${student?.fatherName})`,
          value: { ...student },
        }));

        setData((prevData) => ({
          ...prevData,
          students: allData,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    if (
      selectedData?.fromStandard &&
      selectedData?.fromSection &&
      selectedData?.fromSession
    ) {
      fetchData();
    }
  }, [
    dispatch,
    selectedData?.fromStandard,
    selectedData?.fromSection,
    selectedData?.fromSession,
  ]);

  const getId = (arr) => {
    return arr?.map((item) => item?.value?._id);
  };

  // fetch fee structures
  useEffect(() => {
    const fetchFeeRecords = async () => {
      try {
        const searchData = {
          session: selectedData?.toSession?.name,
          standard: selectedData?.toStandard?._id,
          section: selectedData?.toSection?._id,
        };

        const feeStructureResponse = await instance.get(
          "/feestructure/all?search=" + JSON.stringify(searchData)
        );

        const feeStructure = feeStructureResponse?.data?.data;

        setData((prevState) => ({
          ...prevState,
          feeStructureData: feeStructure[0],
        }));
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    if (
      selectedData?.toSession &&
      selectedData?.toStandard &&
      selectedData?.toSection
    ) {
      fetchFeeRecords();
    }
  }, [
    selectedData?.toSession,
    selectedData?.toStandard,
    selectedData?.toSection,
  ]);

  // updating fee discount after fee record created
  useEffect(() => {
    const addFeeDiscount = async () => {
      const feeDiscountData = selectedData?.feeDiscount;
      const feeStructureData = data?.feeStructureData?.name;

      let feeDiscount = [];

      for (let student of savedStudentsResponse) {
        const feeDiscountAppliedData = feeDiscountData.map((discount) => {
          const feeStructure = feeStructureData.find(
            (fee) => fee?.name?._id === discount?.value?.feeHead
          );

          const feeHeadAmount = feeStructure?.amount;

          let discountAmount = 0;

          if (discount?.value?.discountMode === "Percentage") {
            discountAmount =
              (Number(feeHeadAmount) * Number(discount?.value?.discountValue)) /
              100;
          } else if (discount?.value?.discountMode === "Actual") {
            discountAmount = Number(discount?.value?.discountValue);
          }

          const remainingAmount =
            Number(feeHeadAmount) - Number(discountAmount);
          const isAllPaid = remainingAmount === 0;

          return {
            session: student?.session,
            student: student?._id,
            feeHead: discount?.value?.feeHead,
            feeDiscount: [
              {
                discountId: discount?.value?.discountId,
                feeHead: discount?.value?.feeHead,
                discountValue: discount?.value?.discountValue,
                discountMode: discount?.value?.discountMode,
              },
            ],
            totalDiscount: discountAmount,
            remainingAmount: remainingAmount,
            isAllPaid: isAllPaid,
          };
        });

        feeDiscount.push(...feeDiscountAppliedData);
      }

      const updatedFeeData = await instance.put(
        "/fee-record/fee-discount",
        feeDiscount,
        {
          headers: {
            session: selectedData?.toSession?.name,
          },
        }
      );
      return Promise.resolve(updatedFeeData);
    };

    if (
      selectedData?.feeDiscount?.length > 0 &&
      postAPIResponse?.postFeeRecordResponse?.length > 0 &&
      savedStudentsResponse?.length > 0
    ) {
      addFeeDiscount()
        .then((res) => {
          setSavedStudentsResponse([]);
          setPostAPIResponse({ postFeeRecordResponse: null });
          setLoading(false);
          toast.success("Student migration successfull!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  }, [
    savedStudentsResponse,
    postAPIResponse.postFeeRecordResponse,
    selectedData?.feeDiscount,
    selectedData?.toSession?.name,
    data.feeStructureData,
    dispatch,
  ]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const isRegistrationYearCurrent = useCallback(
    (date) => {
      const registrationDate = new Date(date);
      return registrationDate.getFullYear() === 2024;
    },
    [currentYear]
  );

  // createing fee record for the student
  useEffect(() => {
    const postFeeRecords = async () => {
      try {
        let feeRecordObjects = [];
        const feeStructure = data?.feeStructureData?.name;

        console.log("savedStudentsResponse", savedStudentsResponse);

        for (let student of savedStudentsResponse) {
          const registrationYear = isRegistrationYearCurrent(
            student.registrationDate
          );
          const studentFeeRecords = feeStructure.flatMap(({ name, amount }) => {
            return name?.paidMonth
              .map((month) => {
                if (registrationYear && name?.newStudentOnly) {
                  return {
                    session: student?.session,
                    student: student?._id,
                    standard: student?.standard,
                    section: student?.section,
                    feeHead: name?._id,
                    month: month,
                    fee: amount,
                    isAllPaid: false,
                    totalDiscount: 0,
                    remainingAmount: amount,
                    isPreviousBalance: false,
                    log: [],
                  };
                }

                if (!name?.newStudentOnly) {
                  return {
                    session: student?.session,
                    student: student._id,
                    standard: student?.standard,
                    section: student?.section,
                    feeHead: name?._id,
                    month: month,
                    fee: amount,
                    isAllPaid: false,
                    totalDiscount: 0,
                    remainingAmount: amount,
                    isPreviousBalance: false,
                    log: [],
                  };
                }
                return null;
              })
              .filter(Boolean);
          });

          feeRecordObjects.push(...studentFeeRecords);
        }

        if (
          savedStudentsResponse.length > 0 &&
          feeRecordObjects.length > 0 &&
          feeStructure
        ) {
          const response = await instance.post(
            "/fee-record",
            feeRecordObjects,
            {
              headers: {
                session: selectedData?.toSession?.name,
              },
            }
          );

          const savedFeeRecord = response?.data?.data;

          return Promise.resolve(savedFeeRecord);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        setLoading(false);
      }
    };

    if (savedStudentsResponse.length > 0 && data.feeStructureData) {
      postFeeRecords().then((res) => {
        if (selectedData?.feeDiscount?.length === 0) {
          setSavedStudentsResponse([]);
          setLoading(false);
          toast.success("Success!", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        } else if (selectedData?.feeDiscount?.length > 0) {
          setPostAPIResponse((prevState) => ({
            ...prevState,
            postFeeRecordResponse: res,
          }));
        }
      });
    }
  }, [
    selectedData?.toSession?.name,
    data.feeStructureData,
    selectedData?.feeDiscount,
    savedStudentsResponse,
    dispatch,
    isRegistrationYearCurrent,
  ]);

  // createing opening balance fee record for the student
  useEffect(() => {
    const postPrevSessionBalanceFeeRecords = async () => {
      try {
        const previousFeeRecords = data.prevFeeRecord;
        const feeRecordObjects = previousFeeRecords?.map((feeData) => {
          return {
            session: selectedData?.toSession?._id,
            student: feeData?.student?._id,
            standard: selectedData?.toStandard?._id,
            section: selectedData?.toSection?._id,
            feeHead: feeData?.feeHead?._id,
            month: "April",
            fee: feeData?.totalRemainingBalance,
            isAllPaid: false,
            totalDiscount: 0,
            remainingAmount: feeData?.totalRemainingBalance,
            isPreviousBalance: true,
            log: [],
          };
        });
        if (
          savedStudentsResponse?.length > 0 &&
          feeRecordObjects?.length > 0 &&
          previousFeeRecords?.length > 0
        ) {
          const response = await instance.post(
            "/fee-record",
            feeRecordObjects,
            {
              headers: {
                session: selectedData?.toSession?.name,
              },
            }
          );

          const savedFeeRecord = response?.data?.data;

          return Promise.resolve(savedFeeRecord);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        setLoading(false);
      }
    };

    if (savedStudentsResponse.length > 0 && data.prevFeeRecord.length > 0) {
      postPrevSessionBalanceFeeRecords()
        .then((res) => {
          setData((prevState) => ({
            ...prevState,
            prevFeeRecord: [],
          }));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedData?.toSession?.name, savedStudentsResponse, dispatch]);

  const onMigrateBtnClick = async () => {
    setIsModalOpen(true);
  };

  const validate = () => {
    if (!selectedData?.fromSession) {
      setError((prevState) => ({
        ...prevState,
        fromSession: "Please select from session",
        toSession: "",
        fromStandard: "",
        toStandard: "",
        fromSection: "",
        toSection: "",
      }));
      return false;
    }
    if (!selectedData?.fromStandard) {
      setError((prevState) => ({
        ...prevState,
        fromSession: "",
        toSession: "",
        fromStandard: "Please select from standard",
        toStandard: "",
        fromSection: "",
        toSection: "",
      }));
      return false;
    }
    if (!selectedData?.fromSection) {
      setError((prevState) => ({
        ...prevState,
        fromSession: "",
        toSession: "",
        fromStandard: "",
        toStandard: "",
        fromSection: "Please select from section",
        toSection: "",
      }));
      return false;
    }
    if (!selectedData?.toSession) {
      setError((prevState) => ({
        ...prevState,
        fromSession: "",
        toSession: "Please select to session",
        fromStandard: "",
        toStandard: "",
        fromSection: "",
        toSection: "",
      }));
      return false;
    }
    if (!selectedData?.toStandard) {
      setError((prevState) => ({
        ...prevState,
        fromSession: "",
        toSession: "",
        fromStandard: "",
        toStandard: "Please select to standard",
        fromSection: "",
        toSection: "",
      }));
      return false;
    }
    if (!selectedData?.toSection) {
      setError((prevState) => ({
        ...prevState,
        fromSession: "",
        toSession: "",
        fromStandard: "",
        toStandard: "",
        fromSection: "",
        toSection: "Please select to section",
      }));
      return false;
    }

    return true;
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

      const feeDiscount = selectedData?.feeDiscount?.map((discountData) => {
        return {
          feeDiscountId: discountData?.value?.discountId,
          feeHeadId: discountData?.value?.feeHead,
        };
      });

      const selectedStudentData = selectedData?.student?.map((student) => {
        return {
          ...student?.value,
          session: selectedData?.toSession?._id,
          standard: selectedData?.toStandard?._id,
          section: selectedData?.toSection?._id,
          feeDiscount: feeDiscount || [],
          paper: [],
          additionalPaper: [],
        };
      });

      const savedStudentResp = await instance.post(
        `/student/all?search=${JSON.stringify({
          session: selectedData?.toSession?.name,
        })}`,
        selectedStudentData
      );

      const response = savedStudentResp?.data?.data;

      if (response.length > 0) {
        setSavedStudentsResponse(response);
      }
      // console.log(savedStudentResp?.data?.data);

      // setLoading(false);
    } catch (error) {
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
      <Grid className={styles.container} style={{ minHeight: "88vh" }}>
        <Paper style={{ zIndex: 1 }}>
          <CardHeader
            className={styles.customCardHeader}
            classes={{
              title: styles.customSubheader,
              subheader: styles.customTitle,
            }}
            title="Student From"
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
                  options={data?.fromSession || []}
                  value={selectedData?.fromSession || null}
                  getOptionLabel={(sessions) => sessions?.name}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      fromSession: value,
                      fromStandard: null,
                      fromSection: null,
                      student: [],
                    }));

                    setData((prevState) => ({
                      ...prevState,
                      fromStandard: [],
                      fromSection: [],
                      students: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Session"
                      error={error.fromSession ? true : false}
                      helperText={error.fromSession ? error.fromSession : ""}
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
                  options={data?.fromStandard || []}
                  value={selectedData?.fromStandard || null}
                  getOptionLabel={(options) => options?.standard}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      fromStandard: value,
                    }));

                    setSelectedData((prevState) => ({
                      ...prevState,
                      fromSection: null,
                      student: [],
                    }));
                    setData((prevState) => ({
                      ...prevState,
                      fromSection: [],
                      students: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Standard"
                      error={error.fromStandard ? true : false}
                      helperText={error.fromStandard ? error.fromStandard : ""}
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
                  options={data?.fromSection || []}
                  value={selectedData?.fromSection || null}
                  getOptionLabel={(option) => option?.section}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      fromSection: value,
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
                      error={error.fromSection ? true : false}
                      helperText={error.fromSection ? error.fromSection : ""}
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
        </Paper>

        <Paper style={{ zIndex: 1 }} mt={1}>
          <CardHeader
            className={styles.customCardHeader}
            classes={{
              subheader: styles.customSubheader,
              title: styles.customTitle,
            }}
            title="Student To"
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
                  options={data?.toSession || []}
                  value={selectedData?.toSession || null}
                  getOptionLabel={(sessions) => sessions?.name}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      toSession: value,
                      toStandard: null,
                      toSection: null,
                      feeDiscount: [],
                    }));

                    setData((prevState) => ({
                      ...prevState,
                      toStandard: [],
                      toSection: [],
                      feeDiscount: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Session"
                      error={error.toSession ? true : false}
                      helperText={error.toSession ? error.toSession : ""}
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
                  options={data?.toStandard || []}
                  value={selectedData?.toStandard || null}
                  getOptionLabel={(options) => options?.standard}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      toStandard: value,
                    }));

                    setSelectedData((prevState) => ({
                      ...prevState,
                      toSection: null,
                    }));
                    setData((prevState) => ({
                      ...prevState,
                      toSection: [],
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Standard"
                      error={error.toStandard ? true : false}
                      helperText={error.toStandard ? error.toStandard : ""}
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
                  options={data?.toSection || []}
                  value={selectedData?.toSection || null}
                  getOptionLabel={(option) => option?.section}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      toSection: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Section"
                      error={error.toSection ? true : false}
                      helperText={error.toSection ? error.toSection : ""}
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

              {/* select fee Concession */}
              <Grid item md={4} sm={6} xs={12} style={{ zIndex: 10 }}>
                <InputLabel>Student Fee Concession</InputLabel>
                <MultiSelect
                  options={data?.feeDiscount || []}
                  value={selectedData?.feeDiscount || []}
                  onChange={(value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      feeDiscount: value,
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

export default StudentImport;
