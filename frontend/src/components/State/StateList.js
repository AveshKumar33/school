import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import { Divider, Grid, Card, CardContent, CardHeader } from "@mui/material";

import styles from "./StateList.module.css";
import { authActions } from "../../redux/auth-slice";
import {
  fetchDataWithPagination,
  deleteDataById,
} from "../../redux/http-slice";
import TableSkeleton from "../UI/Skeleton";

const StateList = ({ onClick, newData }) => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //   const [searchQuery, setSearchQuery] = useState("");
  const [index, setIndex] = useState(1);
  const [state, setState] = useState([]);
  const [updatedData, setUpdatedData] = useState();

  const dispatch = useDispatch();

  const { pageData, Loading, deletedData } = useSelector(
    (state) => state.httpRequest
  );

  useEffect(() => {
    setUpdatedData({ ...newData });
  }, [newData]);

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await dispatch(
          deleteDataById({
            path: "/state",
            id: id,
          })
        ).unwrap();

        // change page no if no document available after delete
        if (state.length === 1 && page?.currentPage !== 0) {
          setPage((prevState) => ({
            ...prevState,
            currentPage: page?.currentPage - 1,
          }));
        }
      } catch (error) {
        toast.error(error?.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  const path = `/state?page=${page.currentPage}&perPage=${rowsPerPage}`;

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setState(pageData?.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, pageData]);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
    // getState();
  }, [dispatch, page.currentPage, rowsPerPage, updatedData, path, deletedData]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const editHandler = (data, index) => {
    onClick({ data: data, index: index });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/state-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container}>
        <Card>
          <CardHeader subheader="All States list" title="States List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table
                  sx={{ minWidth: 500 }}
                  aria-label="sticky table"
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {state && state?.length > 0 ? (
                      state?.map((data, idx) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={data?._id}
                          >
                            <TableCell>{index + idx}</TableCell>
                            <TableCell>{data?.name}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteHandler(data?._id, idx)}
                              >
                                <DeleteIcon
                                  className={styles["delete-button"]}
                                />
                              </IconButton>
                              <IconButton
                                onClick={() => editHandler(data, index)}
                              >
                                <BorderColorIcon />
                              </IconButton>
                              <IconButton>
                                <VisibilityIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
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

export default StateList;
