import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

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

import { toast } from "react-toastify";

import styles from "./LocalityList.module.css";
import { authActions } from "../../../redux/auth-slice";
import {
  fetchDataWithPagination,
  deleteDataById,
} from "../../../redux/http-slice";
import TableSkeleton from "../../UI/Skeleton";

const LocalityList = ({ onClick, newData }) => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [index, setIndex] = useState(1);
  const [locality, setLocality] = useState([]);
  const [updatedData, setUpdatedData] = useState();

  const dispatch = useDispatch();

  const { pageData, Loading, deletedData, response } = useSelector(
    (state) => state.httpRequest
  );

  console.log(response);

  useEffect(() => {
    setUpdatedData({ ...newData });
  }, [newData]);

  const path = `/locality?page=${page.currentPage}&perPage=${rowsPerPage}`;

  useEffect(() => {
    if (!Loading && pageData) {
      setPage({ ...page, totaltems: pageData?.totalData });
      setLocality(pageData?.data);
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

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await dispatch(
          deleteDataById({
            path: "/locality",
            id: id,
          })
        ).unwrap();

        // change page no if no document available after delete
        if (locality.length === 1 && page?.currentPage !== 0) {
          setPage((prevState) => ({
            ...prevState,
            currentPage: page?.currentPage - 1,
          }));
        }
      } catch (error) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

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
      <div className={styles["container"]}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/locality-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles["container"]}>
        <Card>
          <CardHeader subheader="All Locality list" title="Locality List" />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table
                  size="small"
                  sx={{ minWidth: 500 }}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Locality
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {locality && locality?.length > 0 ? (
                      locality?.map((data, idx) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={data._id}
                          >
                            <TableCell>{index + idx}</TableCell>
                            <TableCell>{data.name}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="delete"
                                onClick={() => deleteHandler(data._id, idx)}
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

export default LocalityList;
