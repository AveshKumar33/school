import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
// import { RotatingLines } from "react-loader-spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Button,
  TablePagination,
  Divider,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { authActions } from "../../redux/auth-slice";
import {
  fetchDataWithPagination,
  removeDataAndFile,
  viewFile,
} from "../../redux/http-slice";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import Modal from "../UI/Modal";
import styles from "./styles.module.css";
import FileModal from "../UI/FileModal";
import TableSkeleton from "../UI/Skeleton";
import Loader from "../UI/Loader";

const VehicleDriverList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [index, setIndex] = useState(1);
  const [driverData, setDriverData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");

  const [searchData, setSearchData] = useState({
    vehicle: null,
    searchText: "",
  });

  const handleHttpError = useHttpErrorHandler();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pageData, Loading, response, deletedData, updatedData, fileUrl } =
    useSelector((state) => state.httpRequest);

  //   console.log(pageData);

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setDriverData(pageData?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  const path = `/vehicle-driver/?page=${
    page.currentPage
  }&perPage=${rowsPerPage}&search=${JSON.stringify(searchData)}`;

  useEffect(() => {
    const fetchAccountGroup = async () => {
      try {
        const startIndex = page.currentPage * rowsPerPage + 1;
        setIndex(startIndex);
        await dispatch(fetchDataWithPagination({ path })).unwrap();
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
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
    fetchAccountGroup();
  }, [
    dispatch,
    page.currentPage,
    rowsPerPage,
    path,
    response.data,
    deletedData,
    updatedData,
  ]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        removeDataAndFile({
          path: "/vehicle-driver",
          id: idToDelete,
        })
      ).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      handleHttpError(error);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editHandler = (id) => {
    navigate("/edit-driver/" + id);
  };

  const handleViewClick = async (filename, directory) => {
    try {
      dispatch(
        viewFile({
          path: "/vehicle-driver/file",
          filename: `${filename}?dir=${directory}`,
        })
      ).unwrap();
      setIsFileModalOpen(true);
    } catch (error) {
      handleHttpError(error);
      setIsFileModalOpen(false);
    }
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
  };

  return (
    <>
      {Loading && isFileModalOpen && <Loader isLoading={Loading} />}
      {isFileModalOpen && (
        <FileModal onCloseModal={closeFileModal}>
          <span className={styles.close} onClick={closeFileModal}>
            &times;
          </span>
          {fileName.endsWith(".pdf") ? (
            <iframe
              title="Assignment PDF"
              src={fileUrl}
              style={{ width: "60vw", height: "85vh" }}
            ></iframe>
          ) : (
            <img src={fileUrl} alt="Assignment" style={{ width: "20vw" }} />
          )}
        </FileModal>
      )}
      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Delete Account
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to account name
            </p>
            <button
              className={styles["submit-btn"]}
              onClick={handleConfirmDeleteHandler}
            >
              Delete
            </button>
            <button
              className={styles["cancle-button"]}
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/add-driver"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add Driver
            </Button>
          </div>
        </div>
      </div>
      <Box mt={1} className={styles.container}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
                size="small"
                type="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  setSearchData((prevState) => ({
                    ...prevState,
                    // searchText: event.target.value,
                  }));
                }}
                placeholder="Search by Name/Mobile No"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="Account Groups" title="Account Group List" />
          <Divider />
          <CardContent>
            <TableContainer>
              {!Loading ? (
                <Table sx={{ minWidth: 850 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Vehicle Number
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Name
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Mobile No.
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Valid Till
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Contact Add
                      </TableCell>
                      <TableCell align="center" className={styles["bold-cell"]}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {driverData && driverData.length > 0 ? (
                      driverData.map((row, indx) => (
                        <TableRow
                          hover
                          key={row?._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + indx}
                          </TableCell>
                          <TableCell align="left">
                            {row?.vehicle?.vehicleNumber}
                          </TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                          <TableCell align="left">{row?.mobileNo}</TableCell>
                          <TableCell align="left">
                            {moment(row?.validTill).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {row?.contactAddress}
                          </TableCell>
                          <TableCell align="center">
                            <Button
                              variant="text"
                              onClick={() => {
                                editHandler(row?._id);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              color="error"
                              variant="text"
                              onClick={() => {
                                deleteHandler(row?._id);
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              color="success"
                              variant="text"
                              onClick={() => {
                                handleViewClick(row?.aadharCard, "aadhar");
                                setFileName(row?.aadharCard);
                              }}
                            >
                              Aadhar
                            </Button>
                            <Button
                              color="success"
                              variant="text"
                              onClick={() => {
                                handleViewClick(row?.licence, "licence");
                                setFileName(row?.licence);
                              }}
                            >
                              Licence
                            </Button>
                            <Button
                              color="success"
                              variant="text"
                              onClick={() => {
                                handleViewClick(row?.photo, "photo");
                                setFileName(row?.photo);
                              }}
                            >
                              Photo
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <TableSkeleton />
              )}
            </TableContainer>
          </CardContent>
          <Divider />
          {!Loading && (
            <TablePagination
              rowsPerPageOptions={[5, 25, 100]}
              component="div"
              count={page.totaltems || 0}
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

export default VehicleDriverList;
