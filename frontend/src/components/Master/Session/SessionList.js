import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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
  Chip,
  Grid,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { authActions } from "../../../redux/auth-slice";
import {
  fetchDataWithPagination,
  deleteDataById,
  updateDataById,
} from "../../../redux/http-slice";
import Modal from "../../UI/Modal";
import TableSkeleton from "../../UI/Skeleton";
import styles from "./styles.module.css";

const SessionList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [index, setIndex] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActiveModalOpen, setIsActiveModalOpen] = useState(false);
  const [dataToActive, setDataToActive] = useState();
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleHttpError = useHttpErrorHandler();

  const { pageData, Loading, response, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setSessionData(pageData?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  const path = `/session?page=${page.currentPage}&perPage=${rowsPerPage}`;

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
    setAssignmentIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/session",
          id: assignmentIdToDelete,
        })
      ).unwrap();
      setIsModalOpen(false);

      // change page no if no document available after delete
      if (sessionData.length === 1 && page?.currentPage !== 0) {
        setPage((prevState) => ({
          ...prevState,
          currentPage: page?.currentPage - 1,
        }));
      }
    } catch (error) {
      toast.error(error || "Something went wrong", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmActiveHandler = async () => {
    try {
      const formData = {
        ...dataToActive,
        active: true,
      };

      await dispatch(
        updateDataById({
          path: "/session",
          id: dataToActive?.id,
          data: formData,
        })
      ).unwrap();

      setIsActiveModalOpen(false);
    } catch (error) {
      handleHttpError(error);
    }
  };

  const closeActiveModal = () => {
    setIsActiveModalOpen(false);
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
              to this session
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

      {isActiveModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              active this session
            </p>
            <Button
              color="success"
              sx={{ marginRight: 1 }}
              variant="contained"
              onClick={handleConfirmActiveHandler}
            >
              Active
            </Button>
            <Button
              color="warning"
              variant="contained"
              type="button"
              onClick={closeActiveModal}
            >
              Close
            </Button>
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
              to="/session-form"
              sx={{ fontWeight: "bold", marginLeft: "auto" }}
            >
              Add Session
            </Button>
          </div>
        </div>
      </div>

      <Grid className={styles.container} style={{ minHeight: "88vh" }}>
        <Card>
          <CardHeader subheader="Session List" title="Session" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 250 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Session
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Is Current Session
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessionData && sessionData.length > 0 ? (
                      sessionData?.map((row, indx) => (
                        <TableRow
                          key={row?.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell scope="row">{index + indx}</TableCell>
                          <TableCell align="left">{row?.name}</TableCell>
                          <TableCell align="left">
                            {row?.active ? (
                              <Chip
                                label="Yes"
                                style={{
                                  backgroundColor: "#4caf50",
                                  color: "white",
                                }}
                                size="small"
                              />
                            ) : (
                              <Chip
                                label="No"
                                onClick={() => {
                                  setIsActiveModalOpen(true);
                                  setDataToActive(row);
                                }}
                                style={{
                                  backgroundColor: "#f44336",
                                  color: "white",
                                }}
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="text"
                              onClick={() => {
                                navigate("/edit-session/" + row.id);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="text"
                              onClick={() => {
                                deleteHandler(row?.id);
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

export default SessionList;
