import React, { useEffect, useState } from "react";
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
} from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import {
  fetchDataWithPagination,
  deleteDataById,
} from "../../../redux/http-slice";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import Modal from "../../UI/Modal";
import TableSkeleton from "../../UI/Skeleton";
import styles from "./styles.module.css";

const StudentCategoryList = ({ onEditHandler }) => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [index, setIndex] = useState(1);
  const [StudentCategory, setStudentCategory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  const handleHttpError = useHttpErrorHandler();

  const dispatch = useDispatch();

  const { pageData, Loading, response, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  //   console.log(pageData);

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setStudentCategory(pageData?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  const path = `/student-category?page=${page.currentPage}&perPage=${rowsPerPage}`;

  useEffect(() => {
    const fetchStudentCategory = async () => {
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
    fetchStudentCategory();
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

  // filter data for edit
  const filterList = (index) => {
    const updatedStudentCategory = [...StudentCategory];
    updatedStudentCategory.splice(index, 1);
    setStudentCategory(updatedStudentCategory);
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
        deleteDataById({
          path: "/student-category",
          id: idToDelete,
        })
      ).unwrap();
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
              to delete this Student Category.
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
          <Table sx={{ minWidth: 250 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell className={styles["bold-cell"]}>#</TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Student Category
                </TableCell>
                <TableCell align="left" className={styles["bold-cell"]}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {StudentCategory && StudentCategory.length > 0 ? (
                StudentCategory.map((row, indx) => (
                  <TableRow
                    hover
                    key={row?._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {index + indx}
                    </TableCell>
                    <TableCell align="left">{row?.name}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="text"
                        onClick={() => {
                          onEditHandler(row);
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
          rowsPerPageOptions={[10, 25, 100]}
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

export default StudentCategoryList;
