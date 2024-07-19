import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Grid, Card, CardContent, CardHeader, Divider } from "@mui/material";

import { authActions } from "../../../redux/auth-slice";
import {
  deleteDataById,
  fetchDataWithPagination,
} from "../../../redux/http-slice";
import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import styles from "./styles.module.css";
import Modal from "../../UI/Modal";
import TableSkeleton from "../../UI/Skeleton";

// import SearchIcon from "@mui/icons-material/Search";

const FeeDiscount = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [index, setIndex] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feeDiscount, setFeeDiscount] = useState([]);
  const [feeDiscountIdToDelete, setFeeDiscountDataToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleHttpError = useHttpErrorHandler();

  const { pageData, Loading, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    if (!Loading && pageData) {
      setPage((prevState) => ({
        ...prevState,
        totaltems: pageData?.totalData,
      }));
      setFeeDiscount(pageData?.data);
    }
  }, [Loading, pageData]);

  const path = `/fee-discount?page=${page.currentPage}&perPage=${rowsPerPage}`;

  // fetch fee head
  useEffect(() => {
    const fetchexamType = async () => {
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
    fetchexamType();
  }, [dispatch, page.currentPage, rowsPerPage, path, deletedData, updatedData]);

  // delete account group
  const deleteHandler = async (data) => {
    setIsModalOpen(true);
    setFeeDiscountDataToDelete(data);
  };

  console.log(feeDiscount);

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/fee-discount",
          id:
            feeDiscountIdToDelete?._id +
            `?search=${JSON.stringify({
              id: feeDiscountIdToDelete?.feeHead[0]?._id,
            })}`,
        })
      ).unwrap();

      // change page no if no document available after delete
      if (feeDiscount.length === 1 && page?.currentPage !== 0) {
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

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const editHandler = (id) => {
    navigate("/fee/edit-fee-discount-form/" + id);
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
              Cancle
            </button>
          </div>
        </Modal>
      )}
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/fee/fee-discount-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container} style={{ minHeight: "80vh" }}>
        <Card>
          <CardHeader subheader="Fee Head" title="Fee Head List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 1200 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Session</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Discount
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Ammount</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Discount Mode
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Fee Head
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {feeDiscount && feeDiscount?.length > 0 ? (
                      feeDiscount?.map((data, idx) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={idx}
                          >
                            <TableCell>{index + idx}</TableCell>
                            <TableCell>{data?.session?.name}</TableCell>
                            <TableCell>{data?.discountName}</TableCell>
                            <TableCell>{data?.discountValue}</TableCell>
                            <TableCell>{data?.discountMode}</TableCell>
                            <TableCell>
                              {data?.feeHead
                                ?.map((item) => item?.name)
                                .join(", ")}
                            </TableCell>
                            <TableCell>{data?.description}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteHandler(data, idx)}
                              >
                                <DeleteIcon
                                  className={styles["delete-button"]}
                                />
                              </IconButton>
                              <IconButton
                                onClick={() => editHandler(data?._id)}
                              >
                                <BorderColorIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
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
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default FeeDiscount;
