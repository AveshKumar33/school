import React, { useEffect, useState } from "react";
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
  Card,
  Grid,
  CardContent,
  CardHeader,
  TablePagination,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { authActions } from "../../../redux/auth-slice";
import HolidayFilterForm from "./HolidayFilter";
import {
  fetchDataWithPagination,
  pdfDownload,
  excelDownload,
  deleteDataById,
} from "../../../redux/http-slice";
import HolidayForm from "./HolidayForm";
import TableSkeleton from "../../UI/Skeleton";
import Modal from "../../UI/Modal";
import styles from "./styles.module.css";

const Holiday = () => {
  const [mode, setMode] = useState("create");
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [index, setIndex] = useState(1);
  const [holiday, setHoliday] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayIdToDelete, setHlidayIdToDelete] = useState(null);

  const httpErrorHandler = useHttpErrorHandler();

  const initialState = {
    title: "",
    session: "",
    userType: "",
    section: "",
    standard: "",
    startDate: "",
    endDate: "",
    description: "",
  };
  const [searchQuery, setSearchQuery] = useState(initialState);
  const [editedData, setEditedData] = useState(null);
  const dispatch = useDispatch();

  const { pageData, Loading, response, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    if (!Loading && pageData) {
      setPage((prevState) => ({
        ...prevState,
        totaltems: pageData?.totalDat,
      }));
      setHoliday(pageData?.data);
    }
  }, [Loading, pageData]);

  const path =
    `/holiday?page=${page.currentPage}&perPage=${rowsPerPage}&search=` +
    JSON.stringify(searchQuery);

  useEffect(() => {
    const fetchHoliday = async () => {
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

    fetchHoliday();
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

  const handleChange = (event, value) => {
    setMode(value);
    // setSearchQuery(initialState);
  };

  const handlePdfDownload = async () => {
    try {
      await dispatch(
        pdfDownload({ path: "/pdf/holidayPdf", fileName: "Holiday List" })
      ).unwrap();
    } catch (error) {
      httpErrorHandler(error);
      console.log(error);
    }
  };

  const handleExcelDownload = async () => {
    try {
      await dispatch(
        excelDownload({
          path: "/excel/holiday-excel",
          fileName: "Holiday List",
        })
      ).unwrap();
    } catch (error) {
      httpErrorHandler(error);
      console.log(error);
    }
  };

  // filter data for edit
  const filterList = (index) => {
    const updatedHoliday = [...holiday];
    updatedHoliday.splice(index, 1);
    setHoliday(updatedHoliday);
  };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setHlidayIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      dispatch(
        deleteDataById({
          path: "/holiday",
          id: holidayIdToDelete,
        })
      ).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      httpErrorHandler(error);
      setIsModalOpen(false);
    }
  };

  // close delete modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Delete!
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to holiday!
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
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Grid>
          <ToggleButtonGroup
            color="primary"
            value={mode}
            exclusive
            className={styles.container}
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton style={{ fontWeight: "600" }} value="create">
              Create
            </ToggleButton>
            <ToggleButton style={{ fontWeight: "600" }} value="filter">
              Filter
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid>
          <Tooltip title="Pdf">
            <span className={styles.pdf} onClick={handlePdfDownload}>
              <PictureAsPdfIcon color="error" />
            </span>
          </Tooltip>
          <Tooltip title="Excel" onClick={handleExcelDownload}>
            <span className={styles.excel}>
              <NoteAddIcon color="success" />
            </span>
          </Tooltip>
        </Grid>
      </Grid>
      {mode === "create" && (
        <HolidayForm setEditedData={setEditedData} editedData={editedData} />
      )}
      {mode === "filter" && (
        <HolidayFilterForm setSearchQuery={setSearchQuery} />
      )}
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="Holiday" title="Holiday List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 950 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Session
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Holiday Title
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        User Type
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Start Date
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        End Date
                      </TableCell>
                      <TableCell align="center" className={styles["bold-cell"]}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holiday && holiday.length > 0 ? (
                      holiday?.map((row, indx) => (
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
                            {row?.session?.name}
                          </TableCell>
                          <TableCell align="left">{row?.title}</TableCell>
                          <TableCell align="left">
                            {row?.userType
                              ?.map((item) => item?.title)
                              .join(", ")}
                          </TableCell>
                          <TableCell align="left">
                            {moment(row?.startDate).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell align="left">
                            {moment(row?.endDate).format("DD/MM/YYYY")}
                          </TableCell>

                          <TableCell align="left">
                            <Button
                              variant="text"
                              onClick={() => {
                                setMode("create");
                                setEditedData(row);
                                filterList(indx);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="text"
                              onClick={() => {
                                deleteHandler(row?._id);
                              }}
                            >
                              Delete
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
              </TableContainer>
            ) : (
              <TableSkeleton />
            )}
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
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default Holiday;
