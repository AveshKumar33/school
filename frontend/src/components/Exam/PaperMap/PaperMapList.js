import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import instance from "../../../util/axios/config";
import { deleteDataById } from "../../../redux/http-slice";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import Modal from "../../UI/Modal";
import TableSkeleton from "../../UI/Skeleton";
import styles from "../styles.module.css";

const PaperMapList = ({ searchData }) => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [index, setIndex] = useState(1);
  const [paperMap, setPaperMapData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paperMapIdToDelete, setPaperMapDataIdToDelete] = useState(null);
  const [Loading, setLoading] = useState(false);

  const handleHttpError = useHttpErrorHandler();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { response, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  //   console.log(pageData);

  const path = `/paper-map?page=${page.currentPage}&search=${JSON.stringify(
    searchData
  )}&perPage=${rowsPerPage}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const startIndex = page.currentPage * rowsPerPage + 1;
        setIndex(startIndex);
        const response = await instance.get(path);

        setPage({ ...page, totaltems: response?.data?.totalData });
        setPaperMapData(response?.data?.data);
        setLoading(false);
      } catch (error) {
        if (error?.status === 401 || error?.status === 500) {
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
          toast.error(error?.message || "Something went wrong", {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: 2000,
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    };

    if (searchData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    page.currentPage,
    rowsPerPage,
    path,
    response.data,
    deletedData,
    updatedData,
    searchData,
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
    setPaperMapDataIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/paper-map",
          id: paperMapIdToDelete,
        })
      ).unwrap();

      // change page no if no document available after delete
      if (paperMap.length === 1 && page?.currentPage !== 0) {
        setPage((prevState) => ({
          ...prevState,
          currentPage: page?.currentPage - 1,
        }));
      }

      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
      handleHttpError(error);
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
              to delete this!
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
      {!Loading ? (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell className={styles["bold-cell"]}>#</TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Session
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Exam
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Standard
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Section
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Exam Type
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Paper
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Min Marks
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Max Marks
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Weightage
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paperMap && paperMap.length > 0 ? (
                paperMap.map((row, indx) => (
                  <TableRow
                    hover
                    key={row?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + indx}
                    </TableCell>
                    <TableCell align="left">{row?.session?.name}</TableCell>
                    <TableCell align="left">
                      {row?.examName?.examName}
                    </TableCell>
                    <TableCell align="left">
                      {row?.standard?.standard}
                    </TableCell>
                    <TableCell align="left">
                      <List sx={{ padding: "0px" }}>
                        {row?.sections?.map((sec) => {
                          return (
                            <ListItem key={sec?._id} sx={{ padding: "0px" }}>
                              <ListItemText sx={{ margin: "0px" }}>
                                {sec?.section}
                              </ListItemText>
                            </ListItem>
                          );
                        })}
                      </List>
                    </TableCell>
                    <TableCell align="left">
                      {row?.examType?.examType}
                    </TableCell>
                    <TableCell align="left">{row?.paper?.paper}</TableCell>
                    <TableCell align="left">{row?.minMarks}</TableCell>
                    <TableCell align="left">{row?.maxMarks}</TableCell>
                    <TableCell align="left">{row?.weightage}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="text"
                        onClick={() => {
                          navigate("/exam/edit-paper-map-form/" + row?._id);
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
                  <TableCell colSpan={11} align="center">
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
    </>
  );
};

export default PaperMapList;
