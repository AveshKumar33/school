import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { MultiSelect } from "react-multi-select-component";
import moment from "moment";

import {
  Divider,
  Paper,
  Grid,
  Checkbox,
  CardContent,
  CardHeader,
  Box,
  TextField,
  Typography,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import dayjs from "dayjs";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import instance from "../../../util/axios/config";
import FeeHeadList from "./FeeHeadList";
import FileModal from "../../UI/FileModal";
import ApprovedModel from "./ApprovedModel";
import CancelModel from "./CancelModel";
import RevokedModel from "./RevokedModel";
import FeeLogList from "./FeeLogList";
import { authActions } from "../../../redux/auth-slice";
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

const GenerateVoucher = () => {
  const dispatch = useDispatch();

  const [checkedItems, setCheckedItems] = useState([]);
  const [allStandard, setAllStandard] = useState([]);
  const [studentData, setStudentData] = useState();
  const [feeCollection, setFeeCollection] = useState([]);
  const [selected, setSelected] = React.useState([]);
  const [submittingResponses, setSubmittingResponses] = useState(null);
  const [Loading, setLoading] = useState({
    studentDataLoading: false,
    sumbitButtonLoading: false,
  });

  const [data, setData] = useState({
    dataToCancle: null,
    dataToApproved: null,
    dataToRevoke: null,
  });

  const [isOpen, setIsOpen] = useState({
    cancleModal: false,
    approvedModel: false,
    revokedModel: false,
  });

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
    feeHeads: [],
    studentFeeLogs: [],
  });

  const [date] = useState({
    currentDate: dayjs(),
  });

  const [searchQuery, setSearchQuery] = useState({
    session: null,
    standard: [],
    section: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: [],
    section: [],
    student: null,
    paymentMode: "",
  });

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };
  useEffect(() => {
    setTotal((prevState) => ({
      ...prevState,
      totalCurrentBalance:
        Number(total?.totalInitailFee) - Number(total?.totalFee),
    }));
  }, [total?.totalFee, total?.totalInitailFee]);

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

        const allData = data?.map((item) => ({
          label: item.standard,
          value: item._id,
        }));

        setFetchedData((prevData) => ({
          ...prevData,
          standard: allData,
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
    const sectionData = selectedData?.standard?.map((stndr) => {
      const matchingItem = allStandard.find((obj) => obj._id === stndr.value);
      return matchingItem ? matchingItem.sections : [];
    });

    const sections = sectionData?.flat();
    const uniqueSectionsArray = Array.from(
      new Set(sections?.map(JSON.stringify))
    ).map(JSON.parse);

    const allSectionData = uniqueSectionsArray?.map((item) => ({
      label: item?.section,
      value: item?._id,
    }));

    setFetchedData((prevState) => ({
      ...prevState,
      section: allSectionData,
    }));

    if (selectedData?.standard) {
      setSearchQuery((prevState) => ({
        ...prevState,
        standard: getId(selectedData?.standard),
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

    if (
      searchQuery?.session ||
      searchQuery?.standard.length > 0 ||
      searchQuery?.section.length > 0
    ) {
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

  // fetch fee logs
  useEffect(() => {
    const fetchSelectedData = async () => {
      try {
        setLoading((prevState) => ({
          ...prevState,
          studentLogLoading: true,
        }));

        const search = {
          session: selectedData?.session?.name,
          student: selectedData?.student?._id,
          isBankPaid: true,
        };

        const feeRecordsResponse = await instance.get(
          "fee-record/logs?search=" + JSON.stringify(search)
        );

        const feeRecordsData = feeRecordsResponse?.data?.data;

        setFetchedData((prevState) => ({
          ...prevState,
          studentFeeLogs: feeRecordsData,
        }));

        setLoading((prevState) => ({
          ...prevState,
          studentLogLoading: false,
        }));
      } catch (error) {
        setLoading((prevState) => ({
          ...prevState,
          studentLogLoading: false,
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
  }, [
    selectedData?.student,
    selectedData?.session?.name,
    dispatch,
    submittingResponses,
  ]);

  // fetch fee records
  useEffect(() => {
    const fetchData = async () => {
      const search = {
        session: selectedData?.session?.name,
        student: selectedData?.student?._id,
        months: checkedItems,
        isAllPaid: false,
      };

      try {
        const response = await instance.get(
          "/fee-record/all?search=" + JSON.stringify(search)
        );

        const data = response?.data?.data;
        if (response?.data?.status === "success") {
          setFetchedData((prevData) => ({
            ...prevData,
            feeHeads: data,
          }));
        }
        setSelected([]);
      } catch (error) {
        toast.error(error?.response.data.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    if (selectedData?.student) {
      if (checkedItems.length > 0) {
        fetchData();
      }
      // else if (checkedItems.length === 0) {
      //   setFetchedData((prevState) => ({
      //     ...prevState,
      //     feeHeads: [],
      //   }));
      // }
    }
  }, [
    submittingResponses,
    checkedItems,
    selectedData?.session,
    selectedData?.student,
    total?.totalPaidMonts?.length,
  ]);

  // fetch paid fee records of months
  useEffect(() => {
    const fetchData = async () => {
      const search = {
        session: selectedData?.session?.name,
        student: selectedData?.student?._id,
      };

      try {
        const response = await instance.get(
          "/fee-record/all/months?search=" + JSON.stringify(search)
        );

        const data = response?.data?.data;
        if (data?.length > 0) {
          const fullyPaidMonths = Object.entries(
            data.reduce((acc, item) => {
              if (!acc[item.month]) {
                acc[item.month] = [];
              }
              acc[item.month].push(item);
              return acc;
            }, {})
          )
            .filter(([_, items]) => items.every((item) => item.isAllPaid))
            .map(([month]) => month);

          setTotal((prevState) => ({
            ...prevState,
            totalPaidMonts: fullyPaidMonths,
          }));

          setCheckedItems([...fullyPaidMonths]);
        }
      } catch (error) {
        toast.error(error?.response.data.message || "Something went wrong", {
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
  }, [submittingResponses, selectedData?.session?.name, selectedData?.student]);

  useEffect(() => {
    if (fetchedData?.feeHeads?.length > 0) {
      const { totalFee, totalDiscount, feeRecords } =
        fetchedData?.feeHeads.reduce(
          (accumulator, data) => {
            const {
              _id,
              fee,
              totalDiscount,
              feeHead,
              session,
              student,
              standard,
              section,
              month,
              isAllPaid,
              isPreviousBalance,
              remainingAmount,
              incrementedAmount,
              log,
            } = data;

            return {
              totalFee: accumulator.totalFee + Number(remainingAmount),
              totalDiscount: accumulator.totalDiscount + totalDiscount,
              feeRecords: [
                ...accumulator.feeRecords,
                {
                  id: _id,
                  name: feeHead?.name,
                  fee: fee + incrementedAmount,
                  payableAmount: Number(remainingAmount),
                  totalDiscount,
                  session,
                  student,
                  standard,
                  section,
                  month,
                  isAllPaid,
                  remainingAmount: remainingAmount,
                  isPreviousBalance,
                  currentBalance: 0,
                  incrementedAmount,
                  log: log,
                },
              ],
            };
          },
          { totalFee: 0, totalDiscount: 0, feeRecords: [] }
        );

      setTotal((prevState) => ({
        ...prevState,
        totalInitailFee: totalFee,
        totalFee,
        totalDiscount,
      }));
      setFeeCollection(feeRecords);
    } else {
      setFeeCollection([]);
    }
  }, [fetchedData?.feeHeads]);

  const handleCheckboxChange = (label) => {
    setCheckedItems((prevState) => {
      if (prevState?.includes(label)) {
        const monthIndex = months.indexOf(label);
        return [...months.slice(0, monthIndex), ...total?.totalPaidMonts];
      } else {
        const monthIndex = months.indexOf(label);
        return [...months.slice(0, monthIndex + 1), ...total?.totalPaidMonts];
      }
    });
  };

  // const updateFeeData = (updatedData) => {
  //   let totalFee = 0;
  //   const updatedFeeCollection = feeCollection.map((item) => {
  //     if (item.id === updatedData.id) {
  //       totalFee = Number(totalFee) + Number(updatedData?.payableAmount);
  //       return {
  //         ...item,
  //         ...updatedData,
  //       };
  //     }
  //     totalFee = Number(totalFee) + Number(item?.payableAmount);
  //     return item;
  //   });

  //   setTotal((prevState) => ({
  //     ...prevState,
  //     totalFee: totalFee,
  //   }));

  //   setFeeCollection([...updatedFeeCollection]);
  // };

  const updateFeeData = (updatedData) => {
    const updatedFeeCollection = feeCollection.map((item) => {
      if (item.id === updatedData.id) {
        return {
          ...item,
          ...updatedData,
        };
      }
      return item;
    });

    const totalFee = updatedFeeCollection.reduce((acc, item) => {
      return Number(acc) + Number(item.payableAmount || 0);
    }, 0);

    // console.log(totalFee);

    setTotal((prevState) => ({
      ...prevState,
      totalFee,
    }));

    setFeeCollection(updatedFeeCollection);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = feeCollection.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSubmit = async () => {
    setLoading((prevState) => ({
      ...prevState,
      sumbitButtonLoading: true,
    }));

    const currDate = date?.currentDate
      ? dayjs(date?.currentDate).format("YYYY-MM-DD")
      : "";

    const selectedFeeCollection = feeCollection.filter((data) => {
      return selected.includes(data.id);
    });

    const formdData = selectedFeeCollection.map((data) => {
      const {
        id,
        student,
        standard,
        section,
        month,
        payableAmount,
        isAllPaid,
        remainingAmount,
        incrementedAmount,
      } = data;

      return {
        id,
        session: selectedData?.session?._id,
        student,
        standard,
        section,
        month,
        isAllPaid,
        incrementedAmount,
        remainingAmount,
        log: {
          payableAmount: Number(payableAmount),
          remainingAmount: Number(remainingAmount) - Number(payableAmount),
          discount: 0,
          voucherGeneratedDate: currDate,
          isCancel: false,
          isApproved: false,
          isBankPaid: true,
          paymentMode: "Bank",
        },
      };
    });

    if (formdData?.length > 0) {
      try {
        const response = await instance.put(
          "/fee-record/update?search=" +
            JSON.stringify({ session: selectedData?.session?.name }),
          formdData
        );

        if (response?.data?.status === "Success") {
          toast.success(response.data.message, {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
        setSubmittingResponses(response?.data?.data);
      } catch (error) {
        toast.success(error?.response.data.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } else {
      toast.success("Please select the above details first!", {
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

  const handleCancleClick = async (logData) => {
    setData((prevState) => ({
      ...prevState,
      dataToCancle: logData,
      dataToApproved: null,
      dataToRevoke: null,
    }));
  };

  const handleApprovedClick = async (logData) => {
    setData((prevState) => ({
      ...prevState,
      dataToApproved: logData,
      dataToCancle: null,
      dataToRevoke: null,
    }));
  };

  const handleRevokedClick = async (logData) => {
    setData((prevState) => ({
      ...prevState,
      dataToRevoke: logData,
      dataToApproved: null,
      dataToCancle: null,
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
    }
  }, [initialSelectedSession]);

  useEffect(() => {
    if (data?.dataToCancle) {
      setIsOpen((prevState) => ({
        ...prevState,
        cancleModal: true,
        approvedModel: false,
        revokedModel: false,
      }));
    }
    if (data?.dataToApproved) {
      setIsOpen((prevState) => ({
        ...prevState,
        approvedModel: true,
        cancleModal: false,
        revokedModel: false,
      }));
    }
    if (data?.dataToRevoke) {
      setIsOpen((prevState) => ({
        ...prevState,
        revokedModel: true,
        approvedModel: false,
        cancleModal: false,
      }));
    }
  }, [data?.dataToCancle, data?.dataToApproved, data?.dataToRevoke]);

  const closeModal = () => {
    setIsOpen((prevState) => ({
      ...prevState,
      cancleModal: false,
      approvedModel: false,
      revokedModel: false,
    }));
    setData({
      dataToCancle: null,
      dataToApproved: null,
      dataToRevoke: null,
    });
  };

  return (
    <Box className={styles.container} style={{ minHeight: "80vh" }}>
      {isOpen?.approvedModel && (
        <FileModal onCloseModal={closeModal}>
          <ApprovedModel
            closeModal={closeModal}
            sessionName={selectedData?.session?.name}
            data={data}
            setSubmittingResponses={setSubmittingResponses}
          />
        </FileModal>
      )}

      {isOpen?.cancleModal && (
        <FileModal onCloseModal={closeModal}>
          <CancelModel
            closeModal={closeModal}
            sessionName={selectedData?.session?.name}
            data={data}
            setSubmittingResponses={setSubmittingResponses}
          />
        </FileModal>
      )}

      {isOpen?.revokedModel && (
        <FileModal onCloseModal={closeModal}>
          <RevokedModel
            closeModal={closeModal}
            sessionName={selectedData?.session?.name}
            data={data}
            setSubmittingResponses={setSubmittingResponses}
          />
        </FileModal>
      )}

      <Paper>
        <CardHeader title="Generate Voucher" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={6} xs={12}>
              <InputLabel>Session</InputLabel>
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
                    feeHeads: [],
                    studentFeeLogs: [],
                  }));

                  setCheckedItems([]);
                  setSelectedData((prevState) => ({
                    ...prevState,
                    student: null,
                    standard: [],
                    section: [],
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Session" />
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
              <InputLabel>Standard</InputLabel>
              <MultiSelect
                options={fetchedData?.standard || []}
                value={selectedData?.standard || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                  }));
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: [],
                    student: null,
                  }));

                  setCheckedItems([]);
                  setFetchedData((prevState) => ({
                    ...prevState,
                    section: [],
                    students: [],
                    feeHeads: [],
                    studentFeeLogs: [],
                  }));
                }}
                labelledBy={"Select Standard"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12} style={{ zIndex: 210 }}>
              <InputLabel>Section</InputLabel>
              <MultiSelect
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

                  setSelectedData((prevState) => ({
                    ...prevState,
                    student: null,
                  }));
                  setCheckedItems([]);
                  setFetchedData((prevState) => ({
                    ...prevState,
                    students: [],
                    feeHeads: [],
                    studentFeeLogs: [],
                  }));
                }}
                labelledBy={"Select Section"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <InputLabel>Student</InputLabel>
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
                  setCheckedItems([]);
                  setTotal((prevState) => ({
                    ...prevState,
                    totalPaidMonts: [],
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Student" />
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
            selectedData?.student &&
            selectedData?.standard &&
            selectedData?.section &&
            selectedData?.session && (
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
                    {studentData?.dateOfBirth
                      ? moment(studentData?.dateOfBirth).format("DD-MM-YYYY")
                      : "N/A"}
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

          <Grid container spacing={2} wrap="wrap" mt={2}>
            <Grid item md={12} sm={12} xs={12}>
              {months.map((month, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={checkedItems?.includes(month) ? true : false}
                      disabled={
                        total?.totalPaidMonts?.includes(month) ? true : false
                      }
                      style={
                        total?.totalPaidMonts?.includes(month)
                          ? { color: "#008000" }
                          : null
                      }
                      onChange={() => {
                        handleCheckboxChange(month);
                      }}
                    />
                  }
                  label={month}
                />
              ))}
            </Grid>
          </Grid>

          <Grid container spacing={0} wrap="wrap" mt={3}>
            <TableContainer>
              <Table sx={{ minWidth: 1200 }} size="small">
                <TableHead style={{ backgroundColor: "#ccc", color: "#00000" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected?.length > 0 &&
                          selected?.length < feeCollection?.length
                        }
                        checked={
                          feeCollection?.length > 0 &&
                          selected.length === feeCollection?.length
                        }
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      (Discount)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      (Payable Amount)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      (Configured Discount)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      (Submitting Amount)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      (Current Balance)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeCollection && feeCollection.length > 0 ? (
                    feeCollection?.map((data, index) => {
                      const isItemSelected = isSelected(data.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <FeeHeadList
                          handleClick={handleClick}
                          sessionName={selectedData?.session?.name}
                          isItemSelected={isItemSelected}
                          labelId={labelId}
                          key={data?.id}
                          feeData={data}
                          setTotal={setTotal}
                          updateFeeData={updateFeeData}
                          setSubmittingResponses={setSubmittingResponses}
                          total={total}
                        />
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                  {fetchedData?.feeHeads?.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ fontWeight: "bold" }}>
                        Total Fee
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          className={styles.textField}
                          sx={{ backgroundColor: "#f5f5f5" }}
                          id="totalFee"
                          name="Sumbitting Amount"
                          variant="outlined"
                          disabled={true}
                          value={total?.totalDiscount}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          className={styles.textField}
                          sx={{ backgroundColor: "#f5f5f5" }}
                          id="totalFee"
                          name="Sumbitting Amount"
                          variant="outlined"
                          disabled={true}
                          value={total?.totalFee}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          className={styles.textField}
                          sx={{ backgroundColor: "#f5f5f5" }}
                          // id={`${student?._id}_${item?.paperId}_obtainGrade`}
                          id="totalFee"
                          // label="Description"
                          name="Sumbitting Amount"
                          variant="outlined"
                          value={total?.totalCurrentBalance || 0}
                          disabled={true}
                        />
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
              Generate Voucher
            </LoadingButton>
          </Box>
        </CardContent>
      </Paper>

      <Paper style={{ marginTop: "5px" }}>
        <CardHeader
          title="Student Fee Ledger"
          subheader="Payment will not reflect until you approved!"
        />
        <Divider />
        <CardContent>
          <TableContainer>
            <Table sx={{ minWidth: 700 }} size="small">
              <TableHead style={{ backgroundColor: "#172B4D" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    #
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    Receipt No
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    Month
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    Voucher Generated
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    Paid Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#FFFFFF" }}>
                    Action
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: "bold", color: "#FFFFFF" }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentData &&
                selectedData?.student &&
                fetchedData?.studentFeeLogs?.length > 0 ? (
                  fetchedData?.studentFeeLogs?.map((log, index) => (
                    <FeeLogList
                      key={index}
                      row={log}
                      slNo={index}
                      handleApprovedClick={handleApprovedClick}
                      handleCancleClick={handleCancleClick}
                      handleRevokedClick={handleRevokedClick}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default GenerateVoucher;
