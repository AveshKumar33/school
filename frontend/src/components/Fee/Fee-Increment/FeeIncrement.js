import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

import {
  Divider,
  Paper,
  Grid,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Typography,
  Autocomplete,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import instance from "../../../util/axios/config";
import { authActions } from "../../../redux/auth-slice";
import FeeRecordList from "./FeeRecordList";
import Modal from "../../UI/Modal";
import styles from "./styles.module.css";
import StudentDetailsSkeleton from "../../UI/StudentDetailsSkeleton";

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

const FeeIncrement = () => {
  const dispatch = useDispatch();

  const [allStandard, setAllStandard] = useState([]);
  const [studentData, setStudentData] = useState();
  const [Loading, setLoading] = useState({
    studentDataLoading: false,
    sumbitButtonLoading: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  const [total, setTotal] = useState({
    totalInitailFee: 0,
    totalFee: 0,
    totalDiscount: 0,
    totalCurrentBalance: 0,
    totalPaidMonts: [],
  });
  const [fetchedData, setFetchedData] = useState({
    session: [],
    standard: [],
    section: [],
    students: [],
    feeRecords: [],
    feeHeads: [],
    studentFeeLogs: [],
  });

  const [searchQuery, setSearchQuery] = useState({
    session: null,
    standard: null,
    section: null,
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: null,
    section: null,
    student: null,
    paymentMode: "",
  });

  // fetch session
  useEffect(() => {
    const fetchStandard = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        setFetchedData((prevData) => ({
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
          toast.error(error?.response.data.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchStandard();
  }, [dispatch]);

  // fetch standard
  useEffect(() => {
    const fetchStandard = async () => {
      try {
        const standardResp = await instance.get(
          "/standard/all?search=" +
            JSON.stringify({ session: selectedData?.session?.name })
        );

        const data = standardResp?.data?.data;

        setAllStandard(data);

        setFetchedData((prevData) => ({
          ...prevData,
          standard: data,
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
          toast.error(error?.response.data.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (selectedData?.session) {
      fetchStandard();
    }
  }, [dispatch, selectedData?.session]);

  useEffect(() => {
    if (selectedData?.standard) {
      const sectionData = selectedData?.standard?.sections;

      setFetchedData((prevState) => ({
        ...prevState,
        section: sectionData,
      }));
    }
  }, [selectedData?.standard, allStandard]);

  // fetch student name
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await instance.get(
          "/student/name?search=" + JSON.stringify(searchQuery)
        );

        const data = response?.data?.data;

        if (data?.length > 0) {
          setFetchedData((prevData) => ({
            ...prevData,
            students: data,
          }));
        }
      } catch (error) {
        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
          dispatch(authActions.logout());
        } else {
          toast.error(error?.response.data.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (searchQuery?.session && searchQuery?.standard && searchQuery?.section) {
      fetchStudentData();
    }
  }, [searchQuery, dispatch]);

  // fetch student details
  useEffect(() => {
    const fetchSelectedData = async () => {
      try {
        setLoading((prevState) => ({ ...prevState, studentDataLoading: true }));

        const searchData = {
          session: selectedData?.session?.name,
        };

        const studentId = selectedData?.student?._id;

        const searchQueryParam = JSON.stringify(searchData);
        const endpoint = `/student/${studentId}?search=${searchQueryParam}`;

        const studentResponse = await instance.get(endpoint);

        const studentData = studentResponse?.data?.data;

        if (studentData) {
          setStudentData(studentData[0]);
        }

        setLoading((prevState) => ({
          ...prevState,
          studentDataLoading: false,
        }));
      } catch (error) {
        setLoading((prevState) => ({
          ...prevState,
          studentDataLoading: false,
        }));

        if (
          error?.response?.data?.status === 401 ||
          error?.response?.data?.status === 500
        ) {
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

    if (selectedData?.student?._id) {
      fetchSelectedData();
    }
  }, [selectedData?.student?._id, selectedData?.session?.name, dispatch]);

  // fetch fee records and fee heads
  useEffect(() => {
    const fetchData = async () => {
      const search = {
        session: selectedData?.session?.name,
        student: selectedData?.student?._id,
        isAllPaid: false,
      };

      try {
        const [feeHeadResponse, feeRecordResponse] = await Promise.all([
          instance.get(
            "/fee-head/all/session/api?search=" + JSON.stringify(search)
          ),
          instance.get(
            "/fee-record/fee/fee-heads/api?search=" + JSON.stringify(search)
          ),
        ]);

        const feeHeadsData = feeHeadResponse?.data?.data;
        const feeRecordData = feeRecordResponse?.data?.data;

        const feeHeadIdsInRecords = new Set(
          feeRecordData.map((record) => record._id.feeHead)
        );

        const feeHeadMapping = feeHeadsData.reduce((acc, feeHead) => {
          acc[feeHead._id] = feeHead;
          return acc;
        }, {});

        const updatedFeeRecordData = feeRecordData.map((record) => {
          record._id.feeHead = feeHeadMapping[record._id.feeHead] || null;
          return record;
        });

        const feeHeadsNotInRecords = feeHeadsData.filter(
          (feeHead) => !feeHeadIdsInRecords.has(feeHead._id)
        );

        const missingFeeHeadsInFeeRecords = feeHeadsNotInRecords.map(
          (feeHead) => {
            return {
              _id: {
                student: selectedData?.student?._id,
                feeHead: feeHead,
              },
              records: [
                {
                  session: selectedData?.session?._id,
                  student: selectedData?.student?._id,
                  standard: selectedData.standard?._id,
                  section: selectedData?.section?._id,
                  month: "April",
                  fee: 0,
                  feeHead: feeHead?._id,
                  isAllPaid: false,
                  isPreviousBalance: false,
                  totalDiscount: 0,
                  remainingAmount: 0,
                  feeDiscount: [],
                  incrementedAmount: 0,
                  log: [],
                },
              ],
            };
          }
        );

        const allFeeRecord = [
          ...updatedFeeRecordData,
          ...missingFeeHeadsInFeeRecords,
        ];

        allFeeRecord.forEach((group) => {
          group.records.sort((a, b) => {
            const monthIndexA = months.indexOf(a.month);
            const monthIndexB = months.indexOf(b.month);
            return monthIndexA - monthIndexB;
          });

          // Create missing records for months not found in group.records
          months.forEach((month) => {
            const found = group.records.some(
              (record) => record.month === month
            );
            if (!found) {
              const newRecord = {
                session: selectedData?.session?._id,
                student: selectedData.student?._id,
                standard: selectedData.standard?._id,
                section: selectedData?.section?._id,
                month: month,
                fee: 0,
                feeHead: group?._id?.feeHead?._id,
                isAllPaid: false,
                isPreviousBalance: false,
                totalDiscount: 0,
                remainingAmount: 0,
                feeDiscount: [],
                incrementedAmount: 0,
                log: [],
              };
              group.records.push(newRecord);
            }
          });

          // Sort records again after adding missing records
          group.records.sort((a, b) => {
            const monthIndexA = months.indexOf(a.month);
            const monthIndexB = months.indexOf(b.month);
            return monthIndexA - monthIndexB;
          });
        });

        setFetchedData((prevData) => ({
          ...prevData,
          feeHeads: feeHeadsData,
          feeRecords: allFeeRecord,
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

    if (selectedData?.student) {
      fetchData();
    }
  }, [
    selectedData?.session,
    selectedData?.student,
    selectedData?.standard,
    selectedData?.section,
    total?.totalPaidMonts?.length,
  ]);

  const handleSubmit = async () => {
    setIsOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsOpen(false);

    setLoading((prevState) => ({
      ...prevState,
      sumbitButtonLoading: true,
    }));

    const formdData = [];

    for (let feeRecord of fetchedData?.feeRecords) {
      const data = feeRecord.records.filter((record) => {
        return record.hasOwnProperty("_id") || record?.incrementedAmount > 0;
      });

      formdData.push(...data);
    }

    try {
      const response = await instance.post(
        "/fee-record/fee-increment",
        formdData,
        {
          headers: {
            session: selectedData?.session?.name,
            student: selectedData?.student?._id,
          },
        }
      );
      if (response?.data?.status === "Success") {
        setLoading((prevState) => ({
          ...prevState,
          sumbitButtonLoading: false,
        }));
        toast.success("Fee record successfully updated!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.success(error?.response?.data?.message || "Something went wrong", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }

    setLoading((prevState) => ({
      ...prevState,
      sumbitButtonLoading: false,
    }));
  };

  // setting default session year
  const initialSelectedSession = fetchedData?.session?.find((session) => {
    return session?.active === true;
  });

  useEffect(() => {
    if (initialSelectedSession) {
      setSelectedData((prevState) => ({
        ...prevState,
        session: initialSelectedSession,
      }));

      setSearchQuery((prevState) => ({
        ...prevState,
        session: initialSelectedSession?.name,
      }));
    }
  }, [initialSelectedSession]);

  const updateFeeData = ({ feeHead, incrementedAmount, month }) => {
    if (!isNaN(incrementedAmount)) {
      setFetchedData((prevState) => {
        const updatedFeeRecords = prevState.feeRecords.map((feeRecord) => {
          if (feeRecord._id.feeHead._id === feeHead) {
            feeRecord.records = feeRecord.records.map((record) => {
              if (record.month === month) {
                return { ...record, incrementedAmount };
              }
              return record;
            });
          }
          return feeRecord;
        });
        return { ...prevState, feeRecords: updatedFeeRecords };
      });
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Box className={styles.container} style={{ minHeight: "80vh" }}>
      {isOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Fee Record!
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to Submit!
            </p>
            <button
              className={styles["submit-btn"]}
              onClick={handleConfirmSubmit}
            >
              Submit
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

      <Paper>
        <CardHeader title="Generate Voucher" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={6} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={fetchedData?.session || []}
                value={selectedData?.session || null}
                getOptionLabel={(session) => session?.name}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    session: value,
                    student: null,
                    section: null,
                    standard: null,
                  }));

                  setSearchQuery((prevState) => ({
                    ...prevState,
                    session: value?.name,
                  }));

                  setFetchedData((prevState) => ({
                    ...prevState,
                    students: [],
                    standard: [],
                    section: [],
                    feeRecords: [],
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Session" />
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
            <Grid item md={3} sm={6} xs={12} style={{ zIndex: 200 }}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={fetchedData?.standard || []}
                value={selectedData?.standard || null}
                getOptionLabel={(option) => option?.standard}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                    student: null,
                    section: null,
                  }));

                  setFetchedData((prevState) => ({
                    ...prevState,
                    students: [],
                    section: [],
                    feeRecords: [],
                  }));

                  setSearchQuery((prevState) => ({
                    ...prevState,
                    standard: value?._id,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Standard" />
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
            <Grid item md={3} sm={6} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={fetchedData?.section || []}
                value={selectedData?.section || null}
                getOptionLabel={(option) => option?.section}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                    student: null,
                  }));

                  setFetchedData((prevState) => ({
                    ...prevState,
                    students: [],
                    feeRecords: [],
                  }));

                  setSearchQuery((prevState) => ({
                    ...prevState,
                    section: value?._id,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Section" />
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

              {/* <MultiSelect
                options={fetchedData?.section || []}
                value={selectedData?.section || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                  }));

                  setSearchQuery((prevState) => ({
                    ...prevState,
                    section: getId(value),
                  }));
                }}
                labelledBy={"Select Section"}
                isCreatable={false}
                disableSearch={false}
              /> */}
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <Autocomplete
                id="highlights-demo"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={fetchedData?.students || []}
                value={selectedData?.student || null}
                getOptionLabel={(option) =>
                  option?.firstName +
                  " " +
                  option.middleName +
                  " " +
                  option.lastName
                }
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    student: value,
                  }));
                  setFetchedData((prevState) => ({
                    ...prevState,
                    feeHeads: [],
                  }));
                  setTotal((prevState) => ({
                    ...prevState,
                    totalPaidMonts: [],
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Student" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(
                    option?.firstName +
                      " " +
                      option.middleName +
                      " " +
                      option.lastName,
                    inputValue,
                    {
                      insideWords: true,
                    }
                  );
                  const parts = parse(
                    option?.firstName +
                      " " +
                      option.middleName +
                      " " +
                      option.lastName,
                    matches
                  );

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
          </Grid>

          {!Loading?.studentDataLoading ? (
            studentData &&
            selectedData?.student && (
              <Grid
                container
                spacing={1}
                wrap="wrap"
                mt={3}
                p={1}
                sx={{ backgroundColor: "#f5f5f5" }}
              >
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Name:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {`${studentData?.firstName} ${studentData?.middleName} ${studentData?.lastName}`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Class:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {`${studentData?.standard?.standard} - (${studentData?.section?.section})`}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Date Of Birth:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {moment(studentData?.dateOfBirth).format("DD-MM-YYYY")}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Roll No:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {studentData?.rollNo}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Father Name:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {studentData?.fatherName}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Reg. No:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {studentData?.registrationNo}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Mother Name:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {studentData?.motherName}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Admission No:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {studentData?.admissionNo}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Course Type:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {studentData?.courseType?.courseType}
                  </Typography>
                </Grid>
                <Grid
                  item
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                    Student/Parent Mobile No:
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    {`${studentData?.stuMobileNo} / ${studentData?.parentMobileNo}`}
                  </Typography>
                </Grid>
              </Grid>
            )
          ) : (
            <Grid mt={3} p={1}>
              <StudentDetailsSkeleton />
            </Grid>
          )}

          <Grid container spacing={0} wrap="wrap" mt={3}>
            <TableContainer>
              <Table sx={{ minWidth: 1200 }} size="small">
                <TableHead style={{ backgroundColor: "#ccc", color: "#00000" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Fee Head</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>April</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>May</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>June</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>July</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>August</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>September</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>October</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>November</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>December</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>January</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>February</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>March</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedData?.student &&
                  fetchedData?.feeRecords &&
                  fetchedData?.feeRecords?.length > 0 ? (
                    fetchedData?.feeRecords?.map((data, index) => {
                      return (
                        <FeeRecordList
                          // labelId={labelId}
                          key={index}
                          feeRecordData={data}
                          updateFeeData={updateFeeData}
                          // updateFeeData={updateFeeData}
                          // total={total}
                        />
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={13} align="center">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Box display="flex" justifyContent="flex-end">
            <LoadingButton
              variant="contained"
              color="success"
              loading={Loading?.sumbitButtonLoading}
              size="large"
              type="submit"
              sx={{ mt: 3, mb: 1 }}
              onClick={handleSubmit}
            >
              Submit
            </LoadingButton>
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default FeeIncrement;
