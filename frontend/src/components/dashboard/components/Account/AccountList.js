import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Grid,
  Card,
  CardContent,
  CardHeader,
  // Box,
  // TextField,
  // InputAdornment,
  // SvgIcon,
} from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";

import { authActions } from "../../../../redux/auth-slice";
import {
  fetchDataWithPagination,
  deleteDataById,
} from "../../../../redux/http-slice";
import useHttpErrorHandler from "../../../../hooks/useHttpErrorHandler";
import Modal from "../../../UI/Modal";
import TableSkeleton from "../../../UI/Skeleton";
import styles from "./Styles.module.css";

const AccountList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [index, setIndex] = useState(1);
  const [accountGroup, setAccountGroup] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(null);

  const handleHttpError = useHttpErrorHandler();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { pageData, Loading, response, deletedData, updatedData } = useSelector(
    (state) => state.httpRequest
  );

  //   console.log(pageData);

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setAccountGroup(pageData?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  const path = `/account/?page=${page.currentPage}&perPage=${rowsPerPage}`;

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
    setAccountIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/account",
          id: accountIdToDelete,
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
    navigate("/edit-account/" + id);
  };

  return (
    <>
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
      <Button
        color="primary"
        variant="contained"
        component={Link}
        to="/create-account"
        sx={{ fontWeight: "bold", marginLeft: "auto", mt: 2, mb: 2 }}
        mt={1}
      >
        Add Account
      </Button>
      {/* <Box mt={1} className={styles.container}>
        <Card>
          <CardContent>
            <Box maxWidth={500}>
              <TextField
                fullWidth
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
                placeholder="Search account name"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box> */}
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="Account" title="Account List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table sx={{ minWidth: 650 }} size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Account Name
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Account Group
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Opening Balance
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accountGroup && accountGroup.length > 0 ? (
                      accountGroup.map((row, indx) => (
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
                          <TableCell align="left">{row?.accountName}</TableCell>
                          <TableCell align="left">
                            {row?.accountGroupId?.name}
                          </TableCell>
                          <TableCell align="center">
                            {row?.openingBalance}
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="text"
                              onClick={() => {
                                editHandler(row?._id);
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
          </CardContent>
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
        </Card>
      </Grid>
    </>
  );
};

export default AccountList;
