import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TablePagination,
  Divider,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import TeacherSpecializationFilterForm from "./TeacherSpecializationFilterForm";
import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import instance from "../../util/axios/config";
import { deleteDataById } from "../../redux/http-slice";
import { authActions } from "../../redux/auth-slice";
import Modal from "../UI/Modal";
import TableSkeleton from "../UI/Skeleton";
import classes from "./styles.module.css";

const TeacherSpecialization = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [index, setIndex] = useState(1);
  const [allTeachersData, setAllTeachersData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [searchData, setSearchData] = useState({
    session: null,
    standard: null,
    teacher: null,
    section: [],
    paper: [],
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const { deletedData } = useSelector((state) => state.httpRequest);

  const path = `/teacher-specialization?page=${
    page.currentPage
  }&search=${JSON.stringify(searchData)}&perPage=${rowsPerPage}`;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const startIndex = page.currentPage * rowsPerPage + 1;
      setIndex(startIndex);
      const response = await instance.get(path);

      setPage((prevState) => ({
        ...prevState,
        totaltems: response?.data?.totalData,
      }));

      setAllTeachersData(response?.data?.data);
      setLoading(false);
    } catch (error) {
      if (
        error?.response.data?.status === 401 ||
        error?.response.data?.status === 500
      ) {
        setLoading(false);
        toast.error("Please login again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        dispatch(authActions.logout());
      } else {
        setLoading(false);
        toast.error(error?.response.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  }, [dispatch, page.currentPage, rowsPerPage, path]);

  useEffect(() => {
    fetchData();
  }, [fetchData, deletedData]);

  useEffect(() => {
    setPage((prevPage) => ({
      ...prevPage,
      currentPage: 0,
    }));
  }, [searchData]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/teacher-specialization",
          id: idToDelete,
        })
      ).unwrap();

      // change page no if no document available after delete
      if (allTeachersData.length === 1 && page?.currentPage !== 0) {
        setPage((prevState) => ({
          ...prevState,
          currentPage: page?.currentPage - 1,
        }));
      }

      setIsModalOpen(false);
    } catch (error) {
      handleHttpError(error);
      setIsModalOpen(false);
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
              to this
            </p>
            <button
              className={classes["submit-btn"]}
              onClick={handleConfirmDeleteHandler}
            >
              Delete
            </button>
            <button
              className={classes["cancle-button"]}
              type="button"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
      <div className={classes.container}>
        <div className={classes["btn-container"]}>
          <div className={classes.create}>
            <Button
              color="primary"
              variant="contained"
              component={Link}
              to="/teacher-specialization-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Teacher Alloction
            </Button>
          </div>
        </div>
      </div>
      <TeacherSpecializationFilterForm setSearchData={setSearchData} />
      <Grid className={classes.container}>
        <Card>
          <CardHeader
            title="Teachers Specialization"
            subheader="Teacher paper specialization based on class sections"
            className={classes.customCardHeader}
            classes={{
              subheader: classes.customSubheader,
              title: classes.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Session
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Teacher Name
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Standard
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Section
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Paper
                      </TableCell>
                      <TableCell align="left" className={classes["bold-cell"]}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allTeachersData && allTeachersData.length > 0 ? (
                      allTeachersData.map((row, indx) => (
                        <TableRow
                          hover
                          key={indx}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + indx}
                          </TableCell>
                          <TableCell align="left">
                            {row?.session?.startYear +
                              " - " +
                              row?.session?.endYear}
                          </TableCell>
                          <TableCell align="left">
                            {row?.teacher?.salutation +
                              " " +
                              row?.teacher?.firstName +
                              " " +
                              row?.teacher?.middleName +
                              " " +
                              row?.teacher?.lastName}
                          </TableCell>
                          <TableCell align="left">
                            {row?.standard?.standard}
                          </TableCell>
                          <TableCell align="left">
                            {row?.section?.section}
                          </TableCell>
                          <TableCell align="left">
                            {row?.paper.map((p) => p?.paper).join(", ")}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="delete"
                              onClick={() => deleteHandler(row._id)}
                            >
                              <DeleteIcon
                                className={classes["delete-button"]}
                              />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                navigate(
                                  "/teacher-specialization-edit-form/" +
                                    row?._id
                                );
                              }}
                            >
                              <BorderColorIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
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
                rowsPerPageOptions={[20, 50, 100]}
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

export default TeacherSpecialization;
