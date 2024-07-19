import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "react-multi-select-component";
// import { useDispatch } from "react-redux";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import {
  Button,
  Divider,
  Grid,
  Card,
  Paper,
  CardContent,
  CardHeader,
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
} from "@mui/material";

import { authActions } from "../../redux/auth-slice";
import { viewFile } from "../../redux/http-slice";
import TableSkeleton from "../UI/Skeleton";
import FileModal from "../UI/FileModal";
import instance from "../../util/axios/config";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import styles from "./EmployeeList.module.css";
import SendIcon from "@mui/icons-material/Send";

const StudentList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [index, setIndex] = useState(1);
  const [employee, setEmployee] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState({
    searchName: "",
    designation: [],
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHttpError = useHttpErrorHandler();
  const { fileUrl } = useSelector((state) => state.httpRequest);

  const getEmployee = async () => {
    try {
      setIsLoading(true);
      const response = await instance.get(
        `/employee?page=${
          page.currentPage
        }&perPage=${rowsPerPage}&search=${JSON.stringify(searchQuery)}`
      );
      setEmployee(response.data.data);
      setPage({ ...page, totaltems: response.data.totalData });
      if (searchQuery) {
        setPage({
          ...page,
          // currentPage: 0,
          totaltems: response.data.totalData,
        });
      }
      setIsLoading(false);
    } catch (error) {
      handleHttpError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getDesignation = async () => {
      try {
        const response = await instance.get("/designation/all");

        if (response?.data?.status === "Success") {
          const allData = response?.data?.data?.map((item) => ({
            label: item.title,
            value: item._id,
          }));
          setDesignation(allData);
        }
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

    getDesignation();
  }, [dispatch]);

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await instance.delete("/employee/" + id, {
          method: "DELETE",
        });

        const updatedEmployee = employee;
        updatedEmployee.splice(index, 1);

        toast.success("Successflly deleted!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        setEmployee([...updatedEmployee]);
      } catch (error) {
        handleHttpError(error);
      }
    }
  };

  const { currentPage } = page;

  useEffect(() => {
    const startIndex = currentPage * rowsPerPage + 1;
    setIndex(startIndex);
    getEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

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

  const editHandler = (id) => {
    navigate(`/edit-employee/${id}?edit=true`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // getEmployee();
    }, 300);

    return () => {
      clearInterval(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery?.searchName?.length > 0) {
      getEmployee();
    } else {
      toast.error("please enter something", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const getId = (arr) => {
    return arr?.map((item) => item.value);
  };

  useEffect(() => {
    if (searchQuery?.designation?.length > 0) {
      getEmployee();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery?.designation]);

  const handleGetClick = () => {
    if (selectedDesignation.length > 0) {
      const designationId = getId(selectedDesignation);

      setSearchQuery((prevState) => ({
        ...prevState,
        designation: designationId,
      }));
    } else {
      toast.error("Please select designation!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const handleViewClick = async (filename, directory) => {
    try {
      dispatch(
        viewFile({
          path: "/employee/file",
          filename: `${filename}?dir=${directory}`,
        })
      ).unwrap();
      setIsOpen(true);
    } catch (error) {
      handleHttpError(error);
      setIsOpen(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <FileModal onCloseModal={closeModal}>
          <CloseIcon className={styles.close} onClick={closeModal} />
          {fileName.endsWith(".pdf") ? (
            <iframe
              title="Aadhar Card"
              src={fileUrl}
              style={{ width: "60vw", height: "85vh" }}
            ></iframe>
          ) : (
            <img src={fileUrl} alt="emp_photo" style={{ width: "20vw" }} />
          )}
        </FileModal>
      )}

      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/employee-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <Box className={styles.container}>
        <Paper>
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid
                container
                item
                spacing={2}
                wrap="wrap"
                md={6}
                sm={12}
                xs={12}
              >
                <Grid item md={9} sm={9} xs={9}>
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
                    onChange={(e) =>
                      setSearchQuery((prevState) => ({
                        ...prevState,
                        searchName: e.target.value,
                      }))
                    }
                    placeholder="Search name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} sm={3} xs={3}>
                  <Button
                    onClick={handleSearch}
                    endIcon={<SendIcon />}
                    variant="outlined"
                    className={styles["search-bth"]}
                  ></Button>
                </Grid>
              </Grid>
              <Grid
                container
                item
                spacing={2}
                wrap="wrap"
                md={6}
                sm={12}
                xs={12}
              >
                <Grid item md={9} sm={9} xs={9} style={{ zIndex: 19 }}>
                  <MultiSelect
                    options={designation}
                    value={selectedDesignation}
                    onChange={setSelectedDesignation}
                    labelledBy={"Select Designation"}
                    isCreatable={false}
                    disableSearch={false}
                  />
                </Grid>
                <Grid
                  item
                  md={3}
                  sm={3}
                  xs={3}
                  className={styles["get-button"]}
                >
                  <Button variant="contained" onClick={handleGetClick}>
                    Get
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} wrap="wrap" pt={1}></Grid>
          </CardContent>
        </Paper>
      </Box>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="All staff list" title="Staff List" />
          <Divider />
          <CardContent>
            {!isLoading ? (
              <TableContainer>
                <Table sx={{ minWidth: 1600 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Designation
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Father Name
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
                      <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          position: "sticky",
                          right: 0,
                          background: "#fff",
                          zIndex: 1,
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employee.map((data, idx) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={data._id}
                        >
                          <TableCell>{index + idx}</TableCell>
                          <TableCell>{data?.designation.title}</TableCell>
                          <TableCell>{data?.employeeNo}</TableCell>
                          <TableCell>
                            {data?.salutation} {data?.firstName}{" "}
                            {data?.middleName} {data?.lastName}
                          </TableCell>
                          <TableCell>{data?.fatherName}</TableCell>
                          <TableCell>{formatDate(data?.dateOfBirth)}</TableCell>
                          <TableCell>{data?.castCategory?.name}</TableCell>
                          <TableCell>{data?.gender}</TableCell>
                          <TableCell>{data?.mobileNo}</TableCell>
                          <TableCell>{data?.email}</TableCell>
                          <TableCell>{data?.city.name}</TableCell>
                          {/* <TableCell>{data.locality.name}</TableCell> */}
                          <TableCell>{data?.correspondenceAdd}</TableCell>
                          <TableCell
                            sx={{
                              position: "sticky",
                              right: 0,
                              background: "#fff",
                              zIndex: 1,
                            }}
                          >
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteHandler(data?._id, idx)}
                            >
                              <DeleteIcon className={styles["delete-button"]} />
                            </IconButton>
                            <IconButton onClick={() => editHandler(data?._id)}>
                              <BorderColorIcon />
                            </IconButton>
                            <Button
                              className={styles["action-btn"]}
                              color="primary"
                              variant="text"
                              onClick={() => {
                                handleViewClick(data?.aadharCard, "aadhar");
                                setFileName(data?.aadharCard);
                              }}
                            >
                              Aadhar
                            </Button>
                            <Button
                              color="secondary"
                              variant="text"
                              onClick={() => {
                                handleViewClick(data?.photo, "photo");
                                setFileName(data?.photo);
                              }}
                            >
                              Photo
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableSkeleton />
            )}
          </CardContent>
          <Divider />
          {!isLoading && (
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
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
