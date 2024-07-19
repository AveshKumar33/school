import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { authActions } from "../../../redux/auth-slice";
import { deleteDataById } from "../../../redux/http-slice";
import instance from "../../../util/axios/config";
import styles from "./StandardList.module.css";
import Modal from "../../UI/Modal";
import TableSkeleton from "../../UI/Skeleton";

const StandardList = ({ newData }) => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  //   const [searchQuery, setSearchQuery] = useState("");
  const [index, setIndex] = useState(1);
  const [standard, setStandard] = useState([]);
  const [updatedData, setUpdatedData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [standardIdToDelete, setStandardIdToDelete] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleHttpError = useHttpErrorHandler();

  const { Loading, deletedData } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    setUpdatedData({ ...newData });
  }, [newData]);

  const path = `/standard?page=${page.currentPage}&perPage=${rowsPerPage}`;

  useEffect(() => {
    const fetchStandard = async () => {
      try {
        const startIndex = page.currentPage * rowsPerPage + 1;
        setIndex(startIndex);
        const response = await instance.get(path);

        setPage((prevState) => ({
          ...prevState,
          totaltems: response?.data?.totalData,
        }));
        setStandard(response?.data?.data || []);
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
    fetchStandard();
  }, [dispatch, page.currentPage, rowsPerPage, path, deletedData, updatedData]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  // const editHandler = (data, index) => {
  //   onClick({ data: data, index: index });
  // };

  // delete account group
  const deleteHandler = async (id) => {
    setIsModalOpen(true);
    setStandardIdToDelete(id);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      await dispatch(
        deleteDataById({
          path: "/standard",
          id: standardIdToDelete,
        })
      ).unwrap();

      // change page no if no document available after delete
      if (standard.length === 1 && page?.currentPage !== 0) {
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
              to Section
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
      <div style={{ width: "100%" }}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link
              to="/standard-form"
              style={{ display: "flex", alignItems: "center" }}
            >
              CREATE
            </Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            subheader="Standard section map"
            title="Standard List"
            className={styles.customCardHeader}
            classes={{
              subheader: styles.customSubheader,
              title: styles.customTitle,
            }}
          />
          <Divider />
          <CardContent>
            {!Loading ? (
              <TableContainer>
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{ minWidth: 690 }}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Standard
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Section</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {standard && standard?.length > 0 ? (
                      standard?.map((data, idx) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={data?._id}
                          >
                            <TableCell>{index + idx}</TableCell>
                            <TableCell>{data?.standard}</TableCell>
                            <TableCell>
                              <List sx={{ padding: "0px" }}>
                                {data?.sections?.map((sec) => {
                                  return (
                                    <ListItem
                                      key={sec?._id}
                                      sx={{ padding: "0px" }}
                                    >
                                      <ListItemText sx={{ margin: "0px" }}>
                                        {sec?.section}
                                      </ListItemText>
                                    </ListItem>
                                  );
                                })}
                              </List>
                            </TableCell>
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
                                onClick={() => {
                                  navigate("/edit/standard-data/" + data._id);
                                }}
                              >
                                <BorderColorIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
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
              rowsPerPageOptions={[20, 50, 100]}
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

export default StandardList;
