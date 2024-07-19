import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

import {
  Grid,
  Card,
  Paper,
  CardContent,
  InputLabel,
  Button,
  Box,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
  FormLabel,
  Radio,
  RadioGroup,
  OutlinedInput,
  FormControlLabel,
  InputAdornment,
  Typography,
  Chip,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Upload } from "../Global/FileUpload";
import instance from "../../util/axios/config";
import { PhotoUpload } from "../Global/PhotoUpload";
import styles from "./StudentForm.module.css";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  getCity,
  getState,
  getLocality,
  getCourseTyppe,
  getCastCategory,
  getStudentCategory,
  getFeeHead,
} from "../../util/student-apis/student-apis";
import { postDataWithFile, httpActions } from "../../redux/http-slice";
import { authActions } from "../../redux/auth-slice";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import OpeningBalanceInput from "./OpeningBalanceInput";
// import studedentData from "../../SD_Global_Student_List";

const salutation = [
  { label: "Mr.", value: "Mr." },
  { label: "Mrs.", value: "Mrs." },
];

const gender = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const StudentForm = (stuData) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const httpErrorHandler = useHttpErrorHandler();
  const { response } = useSelector((state) => state.httpRequest);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [description, setDesctiption] = useState("");
  const [postAPIResponse, setPostAPIResponse] = useState({
    postStudentResponse: null,
    postFeeRecordResponse: null,
  });
  const [inputList, setInputList] = useState([
    {
      name: {
        name: null,
        _id: null,
        paidMonth: ["April"],
        isPreviousBalance: true,
        newStudentOnly: false,
      },
      amount: "",
    },
  ]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [vehicleDriverData, setVehicleDriverData] = useState();
  const [feeStructureData, setFeeStructureData] = useState();

  const initialstate = {
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    totalMarks: "",
    obtainedMarks: "",
    percentageCGPA: "",
    dateOfBirth: "",
    passingYear: "",
    fatherDateOfBirth: "",
    joiningDate: "",
    registrationDate: "",
    photo: "",
    aadharCard: "",
    marksheet: "",
  };

  const [editValue, setEditedValue] = useState(initialstate);
  const [data, setData] = useState({
    sessions: [],
    city: [],
    locality: [],
    state: [],
    standard: [],
    section: [],
    courseType: [],
    castCategory: [],
    studentCategory: [],
    feeHeads: [],
    feeDiscount: [],
    paper: [],
    vehiclesRoutes: [],
    stoppage: [],
  });

  const [date, setDate] = useState({
    admissionDate: null,
    dateOfBirth: null,
    passingYear: null,
    registrationDate: null,
    joiningDate: null,
    fatherDateOfBirth: null,
    startDate: null, // transport start date
    endDate: null, // transport end date
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    salutation: null,
    gender: null,
    city: null,
    locality: null,
    state: null,
    standard: null,
    section: null,
    courseType: null,
    castCategory: null,
    studentCategory: null,
    isStudent: null,
    isHostelerStudent: null,
    feeDiscount: [],
    paper: [],
    additionalPaper: [],
    vehiclesRoute: null,
    stoppage: null,
  });

  // fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        const data = sessionResp?.data?.data;
        setData((prevState) => ({
          ...prevState,
          sessions: data,
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
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };
    fetchSession();
  }, [dispatch]);

  // fetch standard
  useEffect(() => {
    const fetchStandard = async () => {
      try {
        const standardResp = await instance.get(
          `/standard/all?search=${JSON.stringify({
            session: selectedData?.session?.name,
          })}`
        );

        const data = standardResp?.data?.data;
        setData((prevState) => ({
          ...prevState,
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
          toast.error(error?.message || "Something went wrong", {
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

  // fetch fee discount
  useEffect(() => {
    const fetchFeeDiscount = async () => {
      try {
        const feeDiscountResp = await instance.get(
          `/fee-discount/all?search=${JSON.stringify({
            session: selectedData?.session?.name,
          })}`
        );

        const data = feeDiscountResp?.data?.data;
        setData((prevState) => ({
          ...prevState,
          feeDiscount: data,
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
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (selectedData?.session) {
      fetchFeeDiscount();
    }
  }, [dispatch, selectedData?.session]);

  // setting fetched data
  const getData = useCallback(async () => {
    const [
      cityData,
      localityData,
      stateData,
      courseTypeData,
      CastCategoryData,
      studentCategoryData,
      feeHeadData,
    ] = await Promise.all([
      getCity(),
      getLocality(),
      getState(),
      getCourseTyppe(),
      getCastCategory(),
      getStudentCategory(),
      getFeeHead(),
    ]);

    setData((prevState) => ({
      ...prevState,
      city: cityData,
      locality: localityData,
      state: stateData,
      courseType: courseTypeData,
      castCategory: CastCategoryData,
      studentCategory: studentCategoryData,
      feeHeads: feeHeadData,
    }));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (Object.keys(stuData).length > 0) {
      setValue("firstName", stuData?.stuData?.firstName);
      setValue("middleName", stuData?.stuData?.middleName);
      setValue("lastName", stuData?.stuData?.lastName);
      setValue("stuMobileNo", stuData?.stuData?.stuMobileNo);
      setValue("email", stuData?.stuData?.email);
      setValue("fatherName", stuData?.stuData?.fatherName);
      setValue("motherName", stuData?.stuData?.motherName);
      setValue("fatherQualification", stuData?.stuData?.fatherQualification);
      setValue("fatherOccupation", stuData?.stuData?.fatherOccupation);
      setValue("parentMobileNo", stuData?.stuData?.parentMobileNo);
      setValue("whatsappMobileNo", stuData?.stuData?.whatsappMobileNo);
      setValue("relation", stuData?.stuData?.relation);
      setValue("correspondenceAdd", stuData?.stuData?.correspondenceAdd);
      setValue("permanentAdd", stuData?.stuData?.permanentAdd);
      setValue("postOffice", stuData?.stuData?.postOffice);
      setValue("district", stuData?.stuData?.district);
      setValue("pinCode", stuData?.stuData?.pinCode);
      setValue("nationality", stuData?.stuData?.nationality);
      setValue("schoolName", stuData?.stuData?.schoolName);
      setValue("board", stuData?.stuData?.board);
      setValue("previousStandard", stuData?.stuData?.previousStandard);
      setValue("previousSchoolSub", stuData?.stuData?.previousSchoolSub);

      setDate((prevState) => ({
        ...prevState,
        dateOfBirth: stuData?.stuData?.dateOfBirth,
        passingYear: stuData?.stuData?.passingYear,
      }));

      setEditedValue((prevState) => ({
        ...prevState,
        id: stuData?.stuData?._id,
        totalMarks: stuData?.stuData?.totalMarks,
        obtainedMarks: stuData?.stuData?.obtainedMarks,
        percentageCGPA: stuData?.stuData?.percentageCGPA,
        passingYear: stuData?.stuData?.passingYear,
        dateOfBirth: stuData?.stuData?.dateOfBirth,
      }));

      const seletedGender = gender.find((item) => {
        return item?.value === stuData?.stuData?.gender;
      });

      const selectedSalutation = salutation.find((item) => {
        return item?.value === stuData?.stuData?.salutation;
      });

      setSelectedData({
        session: stuData?.stuData?.session,
        standard: stuData?.stuData?.standard,
        section: stuData?.stuData?.section,
        enqPurpose: stuData?.stuData?.enquiryPurpose,
        courseType: stuData?.stuData?.courseType,
        city: stuData?.stuData?.city,
        locality: stuData?.stuData?.locality,
        state: stuData?.stuData?.state,
        salutation: selectedSalutation,
        gender: seletedGender,
        castCategory: stuData?.stuData?.castCategory,
      });
    }
  }, [stuData, setValue]);

  // fetch paaper
  useEffect(() => {
    setSelectedData((prevSate) => ({ ...prevSate, paper: [] }));
    setData((prevSate) => ({ ...prevSate, paper: [] }));
    const getPaper = async (searchQuery) => {
      try {
        const paperResp = await instance.get(
          `/paper/all?search=${JSON.stringify(searchQuery)}`
        );

        const allPaperData = paperResp.data.data?.map((item) => ({
          label: item?.paper,
          value: item?._id,
        }));

        setData((prevData) => ({
          ...prevData,
          paper: allPaperData,
        }));
      } catch (error) {
        toast.error(error?.response?.data.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };
    if (selectedData?.section && selectedData?.standard) {
      const searchData = {
        session: selectedData?.session?.name,
        standard: selectedData?.standard?._id,
        sections: selectedData?.section?._id,
      };
      getPaper(searchData);
    }
  }, [selectedData?.section, selectedData?.standard, selectedData?.session]);

  // fetch fee structure
  useEffect(() => {
    const fetchData = async (searchData) => {
      try {
        const feeStructureResponse = await instance.get(
          "/feestructure/all?search=" + JSON.stringify(searchData)
        );

        const data = feeStructureResponse?.data?.data;
        setFeeStructureData(data[0]);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    if ((selectedData?.standard, selectedData?.section)) {
      const searchQuery = {
        session: selectedData?.session?.name,
        standard: selectedData?.standard?._id,
        section: selectedData?.section?._id,
      };

      fetchData(searchQuery);
    }
  }, [selectedData?.session, selectedData?.section, selectedData?.standard]);

  // fetch routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const routsResp = await instance.get("/routes/all");

        setData((prevData) => ({
          ...prevData,
          vehiclesRoutes: routsResp.data.data,
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

  // fetch stoppagge or driver
  useEffect(() => {
    const fetchData = async () => {
      try {
        const routeId = selectedData?.vehiclesRoute?._id;
        const filterData = {
          route: routeId,
        };

        const vehicleId = selectedData?.vehiclesRoute?.vehicle;

        const [response, driverData] = await Promise.all([
          instance.get("/stoppage/all?data=" + JSON.stringify(filterData)),
          instance.get(
            "/vehicle-driver/all?search=" +
              JSON.stringify({ vehicle: vehicleId })
          ),
        ]);

        const data = driverData?.data?.data;
        setVehicleDriverData(data[0]);

        const stoppageData = response.data.data;

        setData((prevData) => ({
          ...prevData,
          stoppage: stoppageData,
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

    if (selectedData?.vehiclesRoute) {
      fetchData();
    } else {
      setData((prevState) => ({
        ...prevState,
        stoppage: [],
      }));
      setVehicleDriverData();
    }
  }, [dispatch, selectedData?.vehiclesRoute]);

  const handleRouteChange = () => {
    setSelectedData((prevState) => ({
      ...prevState,
      stoppage: null,
    }));
  };

  // setting default session year
  useEffect(() => {
    if (data?.sessions?.length > 0) {
      const initialSelectedSession = data?.sessions.find((session) => {
        return session?.active === true;
      });

      if (initialSelectedSession) {
        setSelectedData((prevState) => ({
          ...prevState,
          session: initialSelectedSession,
        }));
      }
    }
  }, [data.sessions]);

  const photoField = register("photo", { required: false });
  const marksheetField = register("marksheet", { required: false });
  const aadharField = register("aadharCard", { required: false });

  useEffect(() => {
    if (selectedData?.standard) {
      setData((prevState) => ({
        ...prevState,
        section: selectedData?.standard?.sections,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        section: [],
      }));
    }
  }, [selectedData?.standard]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedMarksheet, setSelectedMarksheet] = useState(null);
  const [selectedAadhar, setSelectedAadhar] = useState(null);

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  // updating fee discount after fee record created
  useEffect(() => {
    const addFeeDiscount = async () => {
      const feeDiscountData = selectedData?.feeDiscount;
      const { postStudentResponse } = postAPIResponse;

      const feeDiscount = feeDiscountData.map((discount) => {
        const feeStructure = feeStructureData?.name?.find(
          (fee) => fee?.name?._id === discount?.feeHeadDetails?._id
        );

        const feeHeadAmount = feeStructure?.amount;

        let discountAmount = 0;

        if (discount?.discountMode === "Percentage") {
          discountAmount =
            (Number(feeHeadAmount) * Number(discount?.discountValue)) / 100;
        } else if (discount?.discountMode === "Actual") {
          discountAmount = Number(discount?.discountValue);
        }

        const remainingAmount = Number(feeHeadAmount) - Number(discountAmount);
        const isAllPaid = remainingAmount === 0;

        return {
          session: postStudentResponse?.session,
          student: postStudentResponse?._id,
          feeHead: discount?.feeHeadDetails?._id,
          feeDiscount: [
            {
              discountId: discount?._id,
              feeHead: discount?.feeHeadDetails?._id,
              discountValue: discount?.discountValue,
              discountMode: discount?.discountMode,
            },
          ],
          totalDiscount: discountAmount,
          remainingAmount: remainingAmount,
          isAllPaid: isAllPaid,
        };
      });

      const updatedFeeData = await instance.put(
        "/fee-record/fee-discount",
        feeDiscount,
        {
          headers: {
            session: selectedData?.session?.name,
          },
        }
      );

      return Promise.resolve(updatedFeeData);
    };

    if (
      selectedData?.feeDiscount?.length > 0 &&
      postAPIResponse?.postStudentResponse &&
      postAPIResponse?.postFeeRecordResponse?.length > 0
    ) {
      addFeeDiscount().then((res) => {
        dispatch(httpActions.clearResponse());
        navigate("/student-list");
      });
    }
  }, [
    postAPIResponse,
    selectedData?.feeDiscount,
    selectedData?.session?.name,
    feeStructureData,
    dispatch,
    navigate,
  ]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const isRegistrationYearCurrent = useCallback(
    (date) => {
      const registrationDate = new Date(date);
      return registrationDate.getFullYear() === currentYear;
    },
    [currentYear]
  );

  // createing fee record for the student
  useEffect(() => {
    const postFeeRecords = async () => {
      try {
        const studentId = response?.data?._id;
        const registrationDate = response?.data?.registrationDate;
        const registrationYear = isRegistrationYearCurrent(registrationDate);

        const initialFeeStructure = [...feeStructureData?.name];
        const additionalFeeStructure = inputList.filter(
          (item) => item.amount > 0 && item.name.name !== null
        );
        const feeStructure = [
          ...additionalFeeStructure,
          ...initialFeeStructure,
        ];

        const feeRecordObjects = feeStructure.flatMap(({ name, amount }) => {
          return name?.paidMonth
            .map((month) => {
              if (registrationYear && name?.newStudentOnly) {
                return {
                  session: selectedData?.session?._id,
                  student: studentId,
                  standard: selectedData?.standard?._id,
                  section: selectedData?.section?._id,
                  feeHead: name?._id,
                  month: month,
                  fee: amount,
                  isAllPaid: false,
                  totalDiscount: 0,
                  remainingAmount: amount,
                  isPreviousBalance: name?.isPreviousBalance || false,
                  incrementedAmount: 0,
                  log: [],
                };
              }

              if (!name?.newStudentOnly) {
                return {
                  session: selectedData?.session?._id,
                  student: studentId,
                  standard: selectedData?.standard?._id,
                  section: selectedData?.section?._id,
                  feeHead: name?._id,
                  month: month,
                  fee: amount,
                  isAllPaid: false,
                  totalDiscount: 0,
                  remainingAmount: amount,
                  isPreviousBalance: name?.isPreviousBalance || false,
                  incrementedAmount: 0,
                  log: [],
                };
              }
              return null;
            })
            .filter(Boolean);
        });

        if (studentId && registrationDate) {
          const response = await instance.post(
            "/fee-record",
            feeRecordObjects,
            {
              headers: {
                session: selectedData?.session?.name,
              },
            }
          );

          const savedFeeRecord = response?.data?.data;

          if (response?.data?.status === "Success") {
            setPostAPIResponse((prevState) => ({
              ...prevState,
              postStudentResponse: response?.data,
              postFeeRecordResponse: savedFeeRecord,
            }));
          }

          return Promise.resolve(savedFeeRecord);
        }
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
      response?.data &&
      feeStructureData &&
      selectedData?.standard?._id &&
      selectedData?.section?._id
    ) {
      postFeeRecords().then((res) => {
        if (selectedData?.feeDiscount?.length === 0) {
          dispatch(httpActions.clearResponse());
          navigate("/student-list");
        } else if (selectedData?.feeDiscount?.length > 0) {
          setPostAPIResponse((prevState) => ({
            ...prevState,
            postFeeRecordResponse: res,
            postStudentResponse: response.data,
          }));
        }
      });
    }
  }, [
    response?.data,
    feeStructureData,
    selectedData?.feeDiscount,
    inputList,
    dispatch,
    navigate,
    isRegistrationYearCurrent,
    selectedData?.standard?._id,
    selectedData?.section?._id,
    selectedData?.session,
  ]);

  // creating transport record
  useEffect(() => {
    const postTransportRecords = async () => {
      try {
        const studentId = response?.data?._id;
        const transportFee = watch("transportFee");

        const start = date?.startDate
          ? dayjs(date?.startDate).format("YYYY-MM-DD")
          : "";

        const end = date?.endDate
          ? dayjs(date?.endDate).format("YYYY-MM-DD")
          : "";

        const formData = [
          {
            session: selectedData?.session?._id,
            standard: selectedData?.standard?._id,
            section: selectedData?.section?._id,
            transportData: [
              {
                student: studentId,
                route: selectedData?.vehiclesRoute?._id,
                stoppage: selectedData?.stoppage?._id,
                transportFee: transportFee,
                startDate: start,
                endDate: end,
                description: description,
              },
            ],
          },
        ];

        await instance.post("/student-transport", formData);
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
      response?.data &&
      selectedData?.standard &&
      selectedData?.section &&
      selectedData?.session &&
      selectedData?.vehiclesRoute &&
      selectedData?.stoppage &&
      date?.endDate &&
      date?.startDate
    ) {
      postTransportRecords();
    }
  }, [
    response?.data,
    watch,
    dispatch,
    selectedData?.standard,
    selectedData?.section,
    selectedData?.session,
    selectedData?.vehiclesRoute,
    selectedData?.stoppage,
    date?.endDate,
    date?.startDate,
    description,
  ]);

  const handleInputChange = (event, index, newValue, field = "amount") => {
    const newInputList = [...inputList];
    if (field === "amount") {
      newInputList[index][field] = Number(event.target.value);
    } else {
      newInputList[index].name[field] = newValue;
      newInputList[index].name._id = newValue?._id;
    }
    setInputList(newInputList);
  };

  const handleListAdd = () => {
    setInputList((prevInputList) => [
      ...prevInputList,
      {
        name: {
          name: null,
          _id: null,
          paidMonth: ["April"],
          isPreviousBalance: true,
          newStudentOnly: false,
        },
        amount: "",
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const newList = [...inputList];
    newList.splice(index, 1);
    setInputList(newList);
  };

  useEffect(() => {
    if (inputList.length > 0) {
      !inputList[inputList?.length - 1].name.name ||
      !inputList[inputList?.length - 1].amount
        ? setIsDisabled(true)
        : setIsDisabled(false);
    }
  }, [inputList]);

  const onSubmit = async (data) => {
    try {
      if (!date?.admissionDate) {
        toast.error("Admission date is required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        return;
      }

      if (!date?.registrationDate) {
        toast.error("Registration date is required!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        return;
      }

      const selectedFeeDiscounts = selectedData?.feeDiscount?.map(
        (discount) => ({
          feeDiscountId: discount?._id,
          feeHeadId: discount?.feeHeadDetails?._id,
        })
      );

      const admissionDate = date?.admissionDate
        ? dayjs(date?.admissionDate).format("YYYY-MM-DD")
        : "";

      const dateOfBirth = date?.dateOfBirth
        ? dayjs(date?.dateOfBirth).format("YYYY-MM-DD")
        : "";

      const passingYear = date?.passingYear
        ? dayjs(date?.passingYear).format("YYYY-MM-DD")
        : "";

      const registrationDate = date?.registrationDate
        ? dayjs(date?.registrationDate).format("YYYY-MM-DD")
        : "";

      const joiningDate = date?.joiningDate
        ? dayjs(date?.joiningDate).format("YYYY-MM-DD")
        : "";

      const fatherDateOfBirth = date?.fatherDateOfBirth
        ? dayjs(date?.fatherDateOfBirth).format("YYYY-MM-DD")
        : "";

      const paperId = getId(selectedData?.paper);
      const additionalPaperId = getId(selectedData?.additionalPaper);

      const postFormData = {
        ...data,
        admissionDate: admissionDate,
        dateOfBirth: dateOfBirth,
        passingYear: passingYear,
        registrationDate: registrationDate,
        joiningDate: joiningDate,
        fatherDateOfBirth: fatherDateOfBirth,
        session: selectedData?.session?._id,
        sessionName: selectedData?.session?.name,
        salutation: selectedData?.salutation?.value,
        gender: selectedData?.gender?.value,
        city: selectedData?.city?._id,
        locality: selectedData?.locality?._id,
        state: selectedData?.state?._id,
        standard: selectedData?.standard?._id,
        section: selectedData?.section?._id,
        castCategory: selectedData?.castCategory?._id,
        courseType: selectedData?.courseType?._id,
        studentCategory: selectedData?.studentCategory?._id,
        isStudent: selectedData?.isStudent,
        isHostelerStudent: selectedData?.isHostelerStudent,
        feeDiscount: selectedFeeDiscounts || [],
        paper: paperId,
        additionalPaper: additionalPaperId,
        percentageCGPA: editValue?.percentageCGPA,
        obtainedMarks: editValue?.obtainedMarks,
        totalMarks: editValue?.totalMarks,
      };

      const formData = new FormData();
      formData.append("photo", selectedPhoto);
      formData.append("marksheet", selectedMarksheet);
      formData.append("aadharCard", selectedAadhar);
      formData.append("data", JSON.stringify(postFormData));

      await dispatch(
        postDataWithFile({ path: "/student", data: formData })
      ).unwrap();
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  // insert bulk student data

  // const processData = async () => {
  //   const students = studedentData.filter(
  //     (student) => student["Course Name"] === "NURSERY"
  //   );

  //   // console.log(students);

  //   const processedData = [];

  //   for (const data of students) {
  //     const [firstName, ...otherNames] = data.Name.split(" ");
  //     const lastName = otherNames.pop() || "";
  //     const middleName = otherNames.join(" ");

  //     processedData.push({
  //       session: "653b8ad9719ba7288084f3a5",
  //       firstName: firstName,
  //       middleName: middleName,
  //       lastName: lastName,
  //       fatherName: data["Father Name"] || "",
  //       stuMobileNo: Number(data["Mobile No"]) || 0,
  //       parentMobileNo: Number(data["Mobile No"]) || 0,
  //       rollNo: Number(data["Roll No"]),
  //       standard: "6565e2410d55a945dd3cef28",
  //       section: "64faee6e228c9a037b7d1d25",
  //     });
  //   }

  //   // console.log(processedData);

  //   try {
  //     await dispatch(
  //       postData({ path: "/student/all", data: processedData })
  //     ).unwrap();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleInsertManyClick = () => {
  //   processData();
  // };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className={styles["main-container"]}
    >
      <Card>
        <CardHeader color="primary" title="Student Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.sessions || []}
                value={selectedData?.session || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    session: value,
                    standard: null,
                    section: null,
                  }));

                  setData((prevState) => ({
                    ...prevState,
                    standard: [],
                    section: [],
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Session" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.admissionNo ? true : false}
                size="small"
                id="outlined-basic"
                label="Admission Number"
                variant="outlined"
                name="admissionNo"
                helperText={errors.admissionNo ? "Field is required!" : ""}
                {...register("admissionNo", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.registrationNo ? true : false}
                size="small"
                id="registrationNo"
                label="Registration Number"
                variant="outlined"
                name="registrationNo"
                helperText={errors.registrationNo ? "Field is required!" : ""}
                {...register("registrationNo", { required: true })}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.srnNo ? true : false}
                size="small"
                id="srnNo"
                label="SRN No/Student Id/Unique Id"
                variant="outlined"
                name="srnNo"
                helperText={errors.srnNo ? "Field is required!" : ""}
                {...register("srnNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.id && (
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
                        value={date?.admissionDate}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            admissionDate: newValue.format(),
                          }))
                        }
                        required
                        label="Admission date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            admissionDate: newValue.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.admissionDate)}
                        label="Admission date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.id && (
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
                        value={date?.registrationDate}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            registrationDate: newValue.format(),
                          }))
                        }
                        label="Registration date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            registrationDate: newValue.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.registrationDate)}
                        label="Registration date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.stuAadharNo ? true : false}
                size="small"
                id="stuAadharNo"
                type="number"
                label="Aadhar Number"
                variant="outlined"
                name="stuAadharNo"
                helperText={errors.stuAadharNo ? "Field is required!" : ""}
                {...register("stuAadharNo")}
              />
            </Grid>

            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={salutation || []}
                value={selectedData?.salutation || null}
                getOptionLabel={(option) => option?.label}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    salutation: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Salutation" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.firstName ? true : false}
                size="small"
                id="outlined-basic1"
                label="First Name"
                variant="outlined"
                name="firstName"
                helperText={errors.firstName ? "Field is required!" : ""}
                {...register("firstName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                size="small"
                id="outlined-basic2"
                label="Middle Name"
                variant="outlined"
                name="middleName"
                {...register("middleName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.lastName ? true : false}
                size="small"
                id="outlined-basic3"
                label="Last Name"
                variant="outlined"
                name="lastName"
                helperText={errors.lastName ? "Field is required!" : ""}
                {...register("lastName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.stuMobileNo ? true : false}
                size="small"
                id="outlined-basic4"
                label="Mobile Number"
                type="number"
                variant="outlined"
                name="stuMobileNo"
                helperText={errors.stuMobileNo ? "Field is required!" : ""}
                {...register("stuMobileNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.email ? true : false}
                size="small"
                id="outlined-basic6"
                label="Email Id"
                type="email"
                variant="outlined"
                name="email"
                helperText={errors.email ? "Field is required!" : ""}
                {...register("email")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormControl fullWidth error={errors.gender ? true : false}>
                <Autocomplete
                  size="small"
                  id="tags-outlined6"
                  options={gender || []}
                  value={selectedData?.gender || null}
                  getOptionLabel={(option) => option?.label}
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value
                  }
                  onChange={(event, value) => {
                    setSelectedData((prevState) => ({
                      ...prevState,
                      gender: value,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender"
                      error={errors.gender ? true : false}
                      {...register("gender")}
                    />
                  )}
                />
                {errors.gender && (
                  <FormHelperText>
                    {errors.gender.message || "Field is required!"}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined6"
                options={data?.castCategory || []}
                value={selectedData?.castCategory || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    castCategory: value,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="Cast" />}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.dateOfBirth && (
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
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            dateOfBirth: newValue.format(),
                          }))
                        }
                        label="Date Of Birth"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.dateOfBirth && (
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
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            dateOfBirth: newValue.format(),
                          }))
                        }
                        label="Date Of Birth"
                        defaultValue={dayjs(date?.dateOfBirth || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.religion ? true : false}
                size="small"
                id="outlined-basic2"
                label="Religion"
                variant="outlined"
                name="religion"
                helperText={errors.religion ? "Field is required!" : ""}
                {...register("religion")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.bloodGroup ? true : false}
                size="small"
                id="outlined-basic3"
                label="Blood Group"
                variant="outlined"
                name="bloodGroup"
                helperText={errors.bloodGroup ? "Field is required!" : ""}
                {...register("bloodGroup")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.motherTongue ? true : false}
                size="small"
                id="outlined-basic4"
                label="Mother Tongue"
                variant="outlined"
                name="motherTongue"
                helperText={errors.motherTongue ? "Field is required!" : ""}
                {...register("motherTongue")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.identificationMarks ? true : false}
                size="small"
                id="outlined-basic"
                label="Identification Marks"
                variant="outlined"
                name="identificationMarks"
                helperText={
                  errors.identificationMarks ? "Field is required!" : ""
                }
                {...register("identificationMarks")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Chip
            label="Opening Balance"
            color="warning"
            variant="outlined"
            clickable
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={8} sm={8} xs={8}>
              {inputList.map((input, index) => (
                <OpeningBalanceInput
                  key={index}
                  index={index}
                  value={input}
                  feeHeades={data?.feeHeads}
                  onInputChange={handleInputChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </Grid>
            <Grid item md={4} sm={4} xs={4}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                className={isDisabled ? styles.disabled : ""}
                disabled={isDisabled}
                onClick={handleListAdd}
              >
                Add More
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="Parents Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.fatherName ? true : false}
                size="small"
                id="outlined-basic4"
                label="Father Name"
                variant="outlined"
                name="fatherName"
                helperText={errors.fatherName ? "Field is required!" : ""}
                {...register("fatherName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.motherName ? true : false}
                size="small"
                id="outlined-basic4"
                label="Mother Name"
                variant="outlined"
                name="motherName"
                helperText={errors.motherName ? "Field is required!" : ""}
                {...register("motherName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.fatherQualification ? true : false}
                size="small"
                id="fatherQualification"
                label="Father Qualification"
                variant="outlined"
                name="fatherQualification"
                helperText={
                  errors.fatherQualification ? "Field is required!" : ""
                }
                {...register("fatherQualification")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.fatherOccupation ? true : false}
                size="small"
                id="fatherOccupation"
                label="Father Occupation"
                variant="outlined"
                name="fatherOccupation"
                helperText={errors.fatherOccupation ? "Field is required!" : ""}
                {...register("fatherOccupation")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.fatherAadharNo ? true : false}
                size="small"
                id="fatherAadharNo"
                type="number"
                label="Father Aadhar Number"
                variant="outlined"
                name="fatherAadharNo"
                helperText={errors.fatherAadharNo ? "Field is required!" : ""}
                {...register("fatherAadharNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.motherAadharNo ? true : false}
                size="small"
                id="motherAadharNo"
                type="number"
                label="Mother Aadhar Number"
                variant="outlined"
                name="motherAadharNo"
                helperText={errors.motherAadharNo ? "Field is required!" : ""}
                {...register("motherAadharNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.parentMobileNo ? true : false}
                size="small"
                id="outlined-basic4"
                label="Mobile Number"
                type="number"
                variant="outlined"
                name="parentMobileNo"
                helperText={errors.parentMobileNo ? "Field is required!" : ""}
                {...register("parentMobileNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.whatsappMobileNo ? true : false}
                size="small"
                id="outlined-basic6"
                label="WhatsApp No"
                type="number"
                variant="outlined"
                name="whatsAppMobileNo"
                helperText={errors.whatsappMobileNo ? "Field is required!" : ""}
                {...register("whatsappMobileNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.id && (
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
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        // value={date.fatherDateOfBirth}
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            fatherDateOfBirth: newValue.format(),
                          }))
                        }
                        label="Father DOB"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                    <DemoItem fullWidth>
                      <DatePicker
                        fullWidth
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-input": {
                            height: "8px",
                          },
                        }}
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            fatherDateOfBirth: newValue.format(),
                          }))
                        }
                        label="Father DOB"
                        //defaultValue={dayjs(date?.fatherDateOfBirth || null)}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>

            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.bankAccountNumber ? true : false}
                size="small"
                id="bankAccountNumber"
                type="number"
                label="Bank Account Number"
                variant="outlined"
                name="bankAccountNumber"
                helperText={
                  errors.bankAccountNumber ? "Field is required!" : ""
                }
                {...register("bankAccountNumber")}
              />
            </Grid>

            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.annualIncome ? true : false}
                size="small"
                id="annualIncome"
                type="number"
                label="Annual Income"
                variant="outlined"
                name="annualIncome"
                helperText={errors.annualIncome ? "Field is required!" : ""}
                {...register("annualIncome")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.relation ? true : false}
                size="small"
                id="relation"
                label="Relation"
                variant="outlined"
                name="relation"
                helperText={errors.relation ? "Field is required!" : ""}
                {...register("relation")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="Address" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.correspondenceAdd ? true : false}
                size="small"
                id="outlined-basic78"
                label="Correspondence Address"
                variant="outlined"
                name="correspondenceAdd"
                helperText={
                  errors.correspondenceAdd ? "Field is required!" : ""
                }
                {...register("correspondenceAdd")}
              />
            </Grid>
            <Grid item md={6} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.permanentAdd ? true : false}
                size="small"
                id="permanentAdd"
                label="Prmanent Address"
                variant="outlined"
                name="permanentAdd"
                helperText={errors.permanentAdd ? "Field is required!" : ""}
                {...register("permanentAdd")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.postOffice ? true : false}
                size="small"
                id="outlined-basic"
                label="Post Office"
                variant="outlined"
                name="postOffice"
                helperText={errors.postOffice ? "Field is required!" : ""}
                {...register("postOffice")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.district ? true : false}
                size="small"
                id="outlined-basic"
                label="District"
                variant="outlined"
                name="district"
                helperText={errors.distric ? "Field is required!" : ""}
                {...register("district")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.city || []}
                value={selectedData?.city || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    city: value,
                  }));
                }}
                renderInput={(params) => <TextField {...params} label="City" />}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.locality || []}
                value={selectedData?.locality || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    locality: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Locality" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.state || []}
                value={selectedData?.state || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    state: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="State" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.pinCode ? true : false}
                size="small"
                id="outlined-basic13"
                label="Pin Code"
                variant="outlined"
                type="number"
                name="pinCode"
                helperText={errors.pinCode ? "Field is required!" : ""}
                {...register("pinCode")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.nationality ? true : false}
                size="small"
                id="outlined-basic21"
                label="Nationality"
                defaultValue="Indian"
                variant="outlined"
                name="nationality"
                helperText={errors.nationality ? "Field is required!" : ""}
                {...register("nationality")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.password ? true : false}
                size="small"
                id="outlined-basic22"
                label="Password"
                variant="outlined"
                name="password"
                helperText={errors.password ? "Field is required!" : ""}
                {...register("password")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 1 }}>
        <CardHeader color="primary" title="Previous Academic Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.schoolName ? true : false}
                size="small"
                id="schoolName"
                label="School Name"
                variant="outlined"
                name="schoolName"
                helperText={errors.schoolName ? "Field is required!" : ""}
                {...register("schoolName")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.board ? true : false}
                size="small"
                id="board"
                label="Board"
                variant="outlined"
                name="board"
                helperText={errors.board ? "Field is required!" : ""}
                {...register("board")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.previousStandard ? true : false}
                size="small"
                id="previousStandard"
                label="Standard"
                variant="outlined"
                name="previousStandard"
                helperText={errors.previousStandard ? "Field is required!" : ""}
                {...register("previousStandard")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              {!editValue?.id && (
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            passingYear: newValue.format(),
                          }))
                        }
                        label="Passing Year"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.passingYear && (
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            passingYear: newValue.format(),
                          }))
                        }
                        defaultValue={dayjs(date?.passingYear || null)}
                        label="Passing Year"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={errors.previousSchoolSub ? true : false}
                size="small"
                id="previousSchoolSub"
                label="Last School Subjects(Comma separated)"
                variant="outlined"
                name="previousSchoolSub"
                helperText={
                  errors.previousSchoolSub ? "Field is required!" : ""
                }
                {...register("previousSchoolSub")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                size="small"
                id="totalMarks"
                label="Total Marks"
                type="number"
                variant="outlined"
                value={editValue?.totalMarks}
                onChange={(event) => {
                  setEditedValue((prevState) => ({
                    ...prevState,
                    totalMarks: event?.target?.value,
                  }));
                }}
                name="totalMarks"
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={
                  Number(editValue?.totalMarks) <
                  Number(editValue?.obtainedMarks)
                    ? true
                    : false
                }
                size="small"
                id="obtainedMarks"
                label="Total Obtained Marks"
                type="number"
                variant="outlined"
                name="obtainedMarks"
                value={editValue?.obtainedMarks || ""}
                onChange={(event) => {
                  setEditedValue((prevState) => ({
                    ...prevState,
                    obtainedMarks: event?.target?.value,
                  }));
                }}
                helperText={
                  Number(editValue?.totalMarks) <
                  Number(editValue?.obtainedMarks)
                    ? "Please Enter Valid Marks!"
                    : ""
                }
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={Number(editValue?.percentageCGPA) > 100 ? true : false}
                size="small"
                id="percentageCGPA"
                label="Percentage/CGPA"
                type="number"
                variant="outlined"
                name="percentageCGPA"
                value={editValue?.percentageCGPA}
                onChange={(event) => {
                  setEditedValue((prevState) => ({
                    ...prevState,
                    percentageCGPA: event?.target?.value,
                  }));
                }}
                helperText={
                  Number(editValue?.percentageCGPA) > 100
                    ? "Please enter valid result!"
                    : ""
                }
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <TextField
                className={styles.textField}
                error={editValue?.TransferCertificateNo ? true : false}
                size="small"
                id="TransferCertificateNo"
                label="Transfer Certificate no"
                variant="outlined"
                name="TransferCertificateNo"
                helperText={
                  errors.TransferCertificateNo ? "Field is required!" : ""
                }
                {...register("TransferCertificateNo")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ mt: 1 }}>
        <CardHeader title="Current Academic Information" />
        <Divider />
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>Standard</InputLabel>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.standard || []}
                value={selectedData?.standard || null}
                getOptionLabel={(option) => option?.standard}
                // filterSelectedOptions
                required
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    standard: value,
                  }));
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Standard" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>Section</InputLabel>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.section || []}
                value={selectedData?.section || null}
                getOptionLabel={(option) => option?.section}
                // filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                required
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    section: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Section" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 11 }}>
              <InputLabel>Select Paper</InputLabel>
              <MultiSelect
                options={data?.paper || []}
                value={selectedData?.paper || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    paper: value,
                  }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 11 }}>
              <InputLabel>Select Additional Papers</InputLabel>
              <MultiSelect
                options={data?.paper || []}
                value={selectedData?.additionalPaper || []}
                onChange={(value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    additionalPaper: value,
                  }));
                }}
                labelledBy={"Select User Type"}
                isCreatable={false}
                disableSearch={false}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>Course Type</InputLabel>
              <Autocomplete
                size="small"
                id="tags-outlined"
                options={data?.courseType || []}
                value={selectedData?.courseType || null}
                getOptionLabel={(option) => option?.courseType}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    courseType: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Course Type" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel htmlFor="rollNo">Roll No</InputLabel>
              <TextField
                className={styles.textField}
                error={errors.rollNo ? true : false}
                size="small"
                id="rollNo"
                label="Roll No"
                type="number"
                variant="outlined"
                name="rollNo"
                helperText={errors.rollNo ? "Field is required!" : ""}
                {...register("rollNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>CBSE Registration Number</InputLabel>
              <TextField
                className={styles.textField}
                error={errors.CBSERegistrationNumber ? true : false}
                size="small"
                id="CBSERegistrationNumber"
                placeholder="CBSE Registration Number"
                variant="outlined"
                name="CBSERegistrationNumber"
                helperText={
                  errors.CBSERegistrationNumber ? "Field is required!" : ""
                }
                {...register("CBSERegistrationNumber")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>Ledger No./CBSE Enrollment No</InputLabel>
              <TextField
                className={styles.textField}
                error={errors.EnrollmentNo ? true : false}
                size="small"
                id="EnrollmentNo"
                placeholder="Ledger No./CBSE Enrollment No."
                variant="outlined"
                name="EnrollmentNo"
                helperText={errors.EnrollmentNo ? "Field is required!" : ""}
                {...register("EnrollmentNo")}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>Joining date</InputLabel>
              {!editValue?.id && (
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            joiningDate: newValue?.format(),
                          }))
                        }
                        placeholder="Joining date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
              {editValue?.id && (
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
                        format="DD/MM/YYYY"
                        onChange={(newValue) =>
                          setDate((prevState) => ({
                            ...prevState,
                            joiningDate: newValue?.format(),
                          }))
                        }
                        // defaultValue={dayjs(date?.joiningDate || null)}
                        placeholder="Joining date"
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              )}
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <InputLabel>Student Category</InputLabel>
              <Autocomplete
                size="small"
                id="tags-outlined6"
                options={data?.studentCategory || []}
                value={selectedData?.studentCategory || null}
                getOptionLabel={(option) => option?.name}
                filterSelectedOptions
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    studentCategory: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Student Category" />
                )}
              />
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Is Student
              </FormLabel>
              <RadioGroup
                size="small"
                row
                value={selectedData?.isStudent || null}
                onChange={(event) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    isStudent: event.target.value,
                  }));
                }}
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="new"
                  control={<Radio size="small" />}
                  label="New Student"
                />
                <FormControlLabel
                  value="old"
                  control={<Radio size="small" />}
                  label="Old Student"
                />
              </RadioGroup>
            </Grid>
            <Grid item md={3} sm={4} xs={12}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Is Hosteler Student:
              </FormLabel>
              <RadioGroup
                size="small"
                row
                value={selectedData?.isHostelerStudent || null}
                onChange={(event) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    isHostelerStudent: event.target.value,
                  }));
                }}
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio size="small" />}
                  label="Yes"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio size="small" />}
                  label="No"
                />
              </RadioGroup>
            </Grid>
            <Grid item md={3} sm={4} xs={12} style={{ zIndex: 10 }}>
              <InputLabel>Student Fee Concession</InputLabel>
              {/* <MultiSelect
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
              /> */}
              <Autocomplete
                multiple
                limitTags={2}
                id="fee-discount"
                size="small"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.feeDiscount || []}
                value={selectedData?.feeDiscount || []}
                getOptionLabel={(options) =>
                  `${options?.discountName} (${options.feeHeadDetails?.name})`
                }
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id &&
                  option?.feeHeadDetails?._id === value?.feeHeadDetails?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    feeDiscount: value,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Fee Discount" />
                )}
                renderOption={(props, options, { inputValue }) => {
                  const matches = match(
                    `${options?.discountName} (${options.feeHeadDetails?.name})`,
                    inputValue,
                    {
                      insideWords: true,
                    }
                  );
                  const parts = parse(
                    `${options?.discountName} (${options.feeHeadDetails?.name})`,
                    matches
                  );

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
          </Grid>
        </CardContent>
      </Paper>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Chip
            label="Transport Configuration"
            color="warning"
            variant="outlined"
            clickable
          />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={4} sm={6} xs={12}>
              <Autocomplete
                size="small"
                id="highlights-demo"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.vehiclesRoutes || []}
                value={selectedData?.vehiclesRoute || null}
                getOptionLabel={(option) =>
                  option?.routeCode +
                  ", " +
                  option?.startPlace +
                  ", " +
                  option?.endPlace +
                  ", " +
                  option?.routeDistance +
                  " Km"
                }
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    vehiclesRoute: value,
                  }));
                  handleRouteChange();
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Vehicle Route" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(
                    option?.routeCode +
                      ", " +
                      option?.startPlace +
                      ", " +
                      option?.endPlace +
                      ", " +
                      option?.routeDistance +
                      " Km",
                    inputValue,
                    {
                      insideWords: true,
                    }
                  );
                  const parts = parse(
                    option?.routeCode +
                      ", " +
                      option?.startPlace +
                      ", " +
                      option?.endPlace +
                      ", " +
                      option?.routeDistance +
                      " Km",
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
            <Grid item md={4} sm={6} xs={12}>
              <Autocomplete
                size="small"
                id="highlights-demo"
                sx={{ width: "100%" }}
                style={{ width: "100%" }}
                options={data?.stoppage || []}
                value={selectedData?.stoppage || null}
                getOptionLabel={(option) => option?.stoppageName}
                isOptionEqualToValue={(option, value) =>
                  option?._id === value?._id
                }
                onChange={(event, value) => {
                  setSelectedData((prevState) => ({
                    ...prevState,
                    stoppage: value,
                  }));
                  setValue("transportFee", value?.transportFee);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Route Stoppage" />
                )}
                renderOption={(props, option, { inputValue }) => {
                  const matches = match(option?.stoppageName, inputValue, {
                    insideWords: true,
                  });
                  const parts = parse(option?.stoppageName, matches);

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
              <FormControl fullWidth size="small">
                <InputLabel htmlFor="transportFee">Transport Fee</InputLabel>
                <OutlinedInput
                  id="transportFee"
                  type="number"
                  onChange={(event) => register("transportFee")(event)}
                  endAdornment={
                    <InputAdornment position="end">/month</InputAdornment>
                  }
                  startAdornment={
                    <InputAdornment position="start">₹</InputAdornment>
                  }
                  {...register("transportFee")}
                  label="Transport Fee"
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ width: "100%" }}
                className={styles.dateInp}
                error={false}
              >
                <DemoContainer
                  components={["DatePicker"]}
                  className={styles.dateInp}
                  sx={{ width: "100%", mt: -1.5 }}
                  error={false}
                >
                  <DemoItem className={styles.dateInp}>
                    <DatePicker
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                          height: "9px",
                        },
                      }}
                      value={date.startDate}
                      format="DD/MM/YYYY"
                      onChange={(newValue) =>
                        setDate((prevState) => ({
                          ...prevState,
                          startDate: newValue?.format(),
                        }))
                      }
                      label="Start Date"
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                sx={{ width: "100%" }}
                className={styles.dateInp}
                locale="en"
                timeZone="Asia/Kolkata"
              >
                <DemoContainer
                  components={["DatePicker"]}
                  className={styles.dateInp}
                  sx={{ width: "100%", mt: -1.5 }}
                >
                  <DemoItem className={styles.dateInp}>
                    <DatePicker
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-input": {
                          height: "9px",
                        },
                      }}
                      format="DD/MM/YYYY"
                      value={date.endDate}
                      onChange={(newValue) =>
                        setDate((prevState) => ({
                          ...prevState,
                          endDate: newValue?.format(),
                        }))
                      }
                      label="End Date"
                    />
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                className={styles.textField}
                size="small"
                id="outlined-basic2"
                label="Description"
                name="description"
                variant="outlined"
                onChange={(event) => setDesctiption(event.target.value)}
              />
            </Grid>
          </Grid>
          {vehicleDriverData && <Divider sx={{ mt: 1 }} />}
          <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
            {vehicleDriverData
              ? `Driver Details : ${vehicleDriverData?.name} (${vehicleDriverData?.mobileNo})`
              : ""}
          </Typography>

          <Typography variant="body1" gutterBottom>
            {vehicleDriverData
              ? `Vechicle details : ${vehicleDriverData?.vehicle?.vehicleNumber}`
              : ""}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Grid container spacing={2} wrap="wrap">
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Photo</InputLabel>
              <PhotoUpload
                onDrop={(file) => {
                  setSelectedPhoto(file[0]);
                }}
                handleFileChange={(e) => {
                  photoField.onChange(e);
                }}
                field={photoField}
                fileAccept=".jpg, .jpeg, .png"
                inpId="photo"
                name="photo"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel htmlFor="aadhar-upload">Marksheet</InputLabel>
              <Upload
                onDrop={(file) => setSelectedMarksheet(file[0])}
                handleFileChange={(e) => {
                  marksheetField.onChange(e);
                }}
                field={marksheetField}
                fileAccept=".pdf, .jpg, .jpeg, .png"
                inpId="marksheet"
                name="marksheet"
              />
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <InputLabel>Aadhar Card</InputLabel>
              <Upload
                onDrop={(file) => {
                  setSelectedAadhar(file[0]);
                }}
                handleFileChange={(e) => {
                  aadharField.onChange(e);
                }}
                field={aadharField}
                fileAccept=".pdf, .jpg, .jpeg, .png"
                inpId="aadhar"
                name="aadharCard"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box className={styles["submit-button"]}>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          style={{ marginRight: "10px" }}
        >
          Submit
        </Button>
        {/* <Button
          color="primary"
          onClick={handleInsertManyClick}
          variant="contained"
        >
          Insert Many
        </Button> */}
      </Box>
    </form>
  );
};

export default StudentForm;
