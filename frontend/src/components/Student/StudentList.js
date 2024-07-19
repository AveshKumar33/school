import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RotatingLines } from "react-loader-spinner";
import instance from "../../util/axios/config";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";

import { Autocomplete, Chip } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
// import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SearchIcon from "@mui/icons-material/Search";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import ExcelExport from "../Global/ExcelExport";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { authActions } from "../../redux/auth-slice";
import styles from "./StudentList.module.css";
import FileModal from "../UI/FileModal";
import { fetchData } from "../../redux/http-slice";
import TableSkeleton from "../UI/Skeleton";
import StudentActiveInActive from "./StudentActiveInActive";

import {
  Button,
  Divider,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  InputAdornment,
  InputLabel,
  SvgIcon,
} from "@mui/material";

const StudentList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [searchQuery, setSearchQuery] = useState({
    text: "",
    standard: [],
    section: [],
    session: null,
  });
  const [index, setIndex] = useState(1);
  const [student, setStudent] = useState([]);
  // const [sortBy, setSortBy] = React.useState("");
  // const [order, setOrder] = React.useState("");
  const [studentActiveInActiveModel, setStudentActiveInActiveModel] =
    useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStudentData, setIsLoadingStudentData] = useState(false);
  const [allStandard, setAllStandard] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dataToActiveInavtive, setDataToActiveInActive] = useState({
    data: "",
    status: "",
    response: "",
  });
  const [fetchedData, setFetchedData] = useState({
    session: [],
    standard: [],
    section: [],
  });

  const [selectedData, setSelectedData] = useState({
    session: null,
    standard: [],
    section: [],
  });

  const { data, Loading } = useSelector((state) => state.httpRequest);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedData((prevState) => ({
      ...prevState,
      section: [],
    }));

    setFetchedData((prevState) => ({ ...prevState, section: [] }));

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
  }, [selectedData?.standard, allStandard]);

  const path = `/student?page=${
    page.currentPage
  }&perPage=${rowsPerPage}&search=${JSON.stringify(searchQuery)}`;

  const getStudent = useCallback(async () => {
    setIsLoadingStudentData(true);
    try {
      const startIndex = page?.currentPage * rowsPerPage + 1;
      setIndex(startIndex);

      const response = await instance.get(path);
      setStudent(response.data.data);
      setPage((prevState) => ({
        ...prevState,
        totaltems: response.data.totalData,
      }));
      if (searchQuery) {
        setPage((prevState) => ({
          ...prevState,
          totaltems: response.data.totalData,
        }));
      }
      setIsLoadingStudentData(false);
    } catch (error) {
      if (
        error?.response?.data?.status === 401 ||
        error?.response?.data?.status === 500
      ) {
        // toast.error("Please login again!", {
        //   position: toast.POSITION.BOTTOM_CENTER,
        //   autoClose: 2000,
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
        dispatch(authActions.logout());
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
      setIsLoadingStudentData(false);
    }
  }, [dispatch, searchQuery, path, page?.currentPage, rowsPerPage]);

  useEffect(() => {
    getStudent();
  }, [getStudent, dataToActiveInavtive?.response]);

  // fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionResp = await instance.get("/session/all");

        const data = sessionResp?.data?.data;
        setFetchedData((prevData) => ({
          ...prevData,
          session: data,
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
    const path = `/standard/all?search=${JSON.stringify({
      session: selectedData?.session?.name,
    })}`;
    const fetchStandard = async () => {
      try {
        await dispatch(fetchData({ path })).unwrap();
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
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

  useEffect(() => {
    if (!Loading && data) {
      setAllStandard(data);
      const allData = data?.map((item) => ({
        label: item.standard,
        value: item._id,
      }));

      setFetchedData((prevData) => ({
        ...prevData,
        standard: allData,
      }));
    }
  }, [Loading, data]);

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await instance.delete("/student/" + id, {
          method: "DELETE",
          headers: {
            session: selectedData?.session?.name,
          },
        });

        const updatedStudent = student;
        updatedStudent.splice(index, 1);

        setStudent([...updatedStudent]);
      } catch (error) {
        if (
          error?.response.data.status === 401 ||
          error?.response.data.status === 500
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
    }
  };

  /**
   * @pdf_generator
   */

  const [pdfUrl, setPdfUrl] = useState(null);

  const generatePDF = async (id) => {
    try {
      setIsLoading(true);
      const response = await instance.get("/pdf/student/" + id, {
        responseType: "blob", // This ensures we receive a binary response (the PDF)
        headers: {
          session: selectedData?.session?.name,
        },
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const pdfUrl = window.URL.createObjectURL(pdfBlob);

      setPdfUrl(pdfUrl);
      setIsOpen(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsLoading(false);
    }
  };

  /**
   * @pdf_generator_end
   */

  // const { currentPage } = page;

  // useEffect(() => {
  //   const startIndex = currentPage * rowsPerPage + 1;
  //   setIndex(startIndex);
  //   if (searchQuery?.searchName !== "" || searchQuery?.standard?.length > 0)
  //     getStudent();
  // }, [currentPage, rowsPerPage, sortBy, order]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const editHandler = (id, sessionName) => {
    navigate("/edit-student/" + id + "?search=" + sessionName);
  };

  // const handleChange = (event) => {
  //   setSortBy(event.target.value);
  // };
  // const handleOrderChange = (event) => {
  //   setOrder(event.target.value);
  // };

  const closeModal = () => {
    setIsOpen(false);
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

  // const handleSearch = () => {
  //   // if (searchQuery?.searchName?.length > 0) {
  //   // } else {
  //   //   toast.error("please enter something", {
  //   //     position: toast.POSITION.BOTTOM_CENTER,
  //   //     autoClose: 2000,
  //   //     hideProgressBar: true,
  //   //     theme: "colored",
  //   //   });
  //   // }
  // };

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  const handleGetClick = (e) => {
    e.preventDefault();

    if (selectedData?.session) {
      const standardId = getId(selectedData?.standard);
      const sectionId = getId(selectedData?.section);
      setSearchQuery((prevState) => ({
        ...prevState,
        session: selectedData?.session?.name,
        standard: standardId,
        section: sectionId,
        text: searchText,
      }));
    } else {
      toast.error("Please select Session, Standard", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  useEffect(() => {
    if (dataToActiveInavtive.data && dataToActiveInavtive.status) {
      setStudentActiveInActiveModel(true);
    }
  }, [dataToActiveInavtive]);

  return (
    <>
      {studentActiveInActiveModel && (
        <FileModal>
          <StudentActiveInActive
            setStudentActiveInActiveModel={setStudentActiveInActiveModel}
            setDataToActiveInActive={setDataToActiveInActive}
            dataToActiveInavtive={dataToActiveInavtive}
            sessionName={selectedData?.session?.name}
          />
        </FileModal>
      )}

      {isLoading && (
        <div id="myModal" className={styles.modal}>
          <div className={styles.loader}>
            <RotatingLines
              strokeColor="#4a4a4b"
              strokeWidth="3"
              animationDuration="0.75"
              width="50"
              visible={isLoading}
            />
          </div>
        </div>
      )}

      {isOpen && pdfUrl && (
        <div id="myModal" className={styles.modal}>
          <div className={styles["modal-content"]}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <iframe
              title="_doc"
              src={pdfUrl}
              style={{ width: "100%", height: "90vh" }}
            ></iframe>
          </div>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div>
            <ExcelExport searchQuery={searchQuery} />
          </div>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/student-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add Student
            </Button>
          </div>
        </div>
      </div>
      <Box className={styles.container}>
        <Paper>
          <CardContent>
            <form onSubmit={handleGetClick}>
              <Grid container spacing={2} wrap="wrap" pb={2}>
                <Grid
                  container
                  item
                  spacing={1}
                  wrap="wrap"
                  // md={6}
                  // sm={12}
                  // xs={12}
                >
                  <Grid item md={6} sm={12} xs={9}>
                    <TextField
                      fullWidth
                      style={{ zIndex: 1 }}
                      type="search"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SvgIcon fontSize="small" color="action">
                              <SearchIcon />
                            </SvgIcon>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                      }}
                      placeholder="Name/Roll/Admission/Registration No"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                {/* <Grid
                container
                justifyContent="flex-end"
                spacing={2}
                wrap="wrap"
                item
                md={6}
                sm={12}
                xs={12}
              >
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Select
                      displayEmpty
                      value={sortBy}
                      onChange={handleChange}
                      input={<OutlinedInput />}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem disabled value="">
                        <em>Sort By</em>
                      </MenuItem>
                      <MenuItem key="standard" value="standard">
                        Standard
                      </MenuItem>
                      <MenuItem key="section" value="section">
                        Section
                      </MenuItem>
                      <MenuItem key="name" value="firstName">
                        Name
                      </MenuItem>
                      <MenuItem key="RollNo" value="rollNo">
                        Roll No
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Select
                      displayEmpty
                      value={order}
                      onChange={handleOrderChange}
                      input={<OutlinedInput />}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem disabled value="">
                        <em>Order By</em>
                      </MenuItem>
                      <MenuItem key="ascending" value="asc">
                        Ascending
                      </MenuItem>
                      <MenuItem key="descending" value="desc">
                        Descnding
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid> */}
              </Grid>

              <Grid container spacing={2} wrap="wrap" pt={1}>
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
                        standard: [],
                        section: [],
                      }));
                      setFetchedData((prevState) => ({
                        ...prevState,
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
                    }}
                    labelledBy={"Select Section"}
                    isCreatable={false}
                    disableSearch={false}
                  />
                </Grid>
                <Grid
                  item
                  md={3}
                  sm={6}
                  xs={12}
                  className={styles["get-button"]}
                >
                  <Button variant="contained" type="submit">
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Paper>
      </Box>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="All grade student list" title="Student List" />
          <Divider />
          <CardContent>
            {!isLoadingStudentData ? (
              <TableContainer>
                <Table
                  sx={{ minWidth: 1900 }}
                  size="small"
                  className={styles["main-table"]}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Session</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Standard
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Roll No</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Father Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Mother Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>DOB</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Cast</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Gender</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Mobile No
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Email Id
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>City</TableCell>
                      {/* <TableCell sx={{ fontWeight: "bold" }}>Locality</TableCell> */}
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Address1
                      </TableCell>
                      {/* <TableCell>Address2</TableCell> */}
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          position: "sticky",
                          right: 0,
                          background: "#fff",
                          zIndex: 1,
                        }}
                        align="center"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {student && student?.length > 0 ? (
                      student?.map((data, idx) => {
                        return (
                          <TableRow hover key={data._id}>
                            <TableCell>{index + idx}</TableCell>
                            <TableCell>{data?.session?.name}</TableCell>
                            <TableCell>{data?.standard?.standard}</TableCell>
                            <TableCell>{data?.section?.section}</TableCell>
                            <TableCell>{data?.rollNo}</TableCell>
                            <TableCell>
                              {data?.salutation} {data?.firstName}{" "}
                              {data?.middleName} {data?.lastName}
                            </TableCell>
                            <TableCell>{data?.fatherName}</TableCell>
                            <TableCell>{data?.motherName}</TableCell>
                            <TableCell>
                              {data?.dateOfBirth
                                ? formatDate(data?.dateOfBirth)
                                : ""}
                            </TableCell>
                            <TableCell>{data?.castCategory?.name}</TableCell>
                            <TableCell>{data?.gender}</TableCell>
                            <TableCell>{data?.mobileNo}</TableCell>
                            <TableCell>{data?.email}</TableCell>
                            <TableCell>{data?.city?.name}</TableCell>
                            {/* <TableCell>{data.locality.name}</TableCell> */}
                            <TableCell>{data?.correspondenceAdd}</TableCell>
                            {/* <TableCell>{data.permanentAdd}</TableCell> */}
                            <TableCell
                              sx={{
                                fontWeight: "bold",
                                position: "sticky",
                                right: 0,
                                background: "#fff",
                                zIndex: 1,
                              }}
                              align="right"
                            >
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteHandler(data?._id, idx)}
                              >
                                <DeleteIcon
                                  className={styles["delete-button"]}
                                />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  editHandler(data?._id, data?.session?.name)
                                }
                              >
                                <BorderColorIcon />
                              </IconButton>
                              <IconButton
                                onClick={() => generatePDF(data?._id)}
                              >
                                <PictureAsPdfIcon />
                              </IconButton>

                              {data?.isActive ? (
                                <Chip
                                  label="ACTIVE"
                                  onClick={() => {
                                    setDataToActiveInActive({
                                      data: data?._id,
                                      status: "active",
                                      response: "",
                                    });
                                  }}
                                  style={{
                                    backgroundColor: "#4caf50",
                                    color: "white",
                                  }}
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label="INACTIVE"
                                  onClick={() => {
                                    setDataToActiveInActive({
                                      data: data?._id,
                                      status: "inactive",
                                      response: "",
                                    });
                                  }}
                                  style={{
                                    backgroundColor: "#f44336",
                                    color: "white",
                                  }}
                                  size="small"
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell>No data available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableSkeleton />
            )}
          </CardContent>
          <Divider />
          {!isLoadingStudentData && (
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={page.totaltems}
              rowsPerPage={rowsPerPage}
              page={page.currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Grid>
    </>
  );
};

export default StudentList;
