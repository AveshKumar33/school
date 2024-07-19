import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { useDispatch } from "react-redux";
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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import styles from "./FeeStructureList.module.css";
import { authActions } from "../../../redux/auth-slice";
import axios from "../../../util/axios/config";

const FeeStructureList = () => {
  const [page, setPage] = useState({ currentPage: 0, totaltems: 0 });
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [index, setIndex] = useState(1);
  const [feeStructure, setFeeStructure] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFeeStructure = useCallback(async () => {
    try {
      const startIndex = page.currentPage * rowsPerPage + 1;
      setIndex(startIndex);

      const response = await axios.get(
        `feestructure?page=${page.currentPage}&perPage=${rowsPerPage}`
      );
      setFeeStructure(response.data.data);
      setPage((prevState) => ({
        ...prevState,
        totaltems: response.data.totalData,
      }));
    } catch (error) {
      if (
        error?.response?.data?.status === 401 ||
        error?.response?.data?.status === 500
      ) {
        toast.error("Please login again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        dispatch(authActions.logout());
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  }, [dispatch, page?.currentPage, rowsPerPage]);

  const deleteHandler = async (id, index) => {
    const proceed = window.confirm("Are you really want to delete?");

    if (proceed) {
      try {
        await axios.delete("/feestructure/" + id, {
          method: "DELETE",
        });

        const updatedFeeStructure = feeStructure;
        updatedFeeStructure.splice(index, 1);

        setFeeStructure([...updatedFeeStructure]);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  /**
   * @pdf_generator
   */

  const [pdfUrl, setPdfUrl] = useState(null);

  const generatePDF = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get("/pdf/fee-structure/" + id, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
      setIsOpen(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setIsLoading(false);
    }
  };

  /**
   * @pdf_generator_end
   */

  useEffect(() => {
    getFeeStructure();
  }, [getFeeStructure]);

  const handleChangePage = (event, newPage) => {
    setPage((prevState) => ({ ...prevState, currentPage: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage((prevState) => ({ ...prevState, currentPage: 0 }));
  };

  const editHandler = (id) => {
    navigate("/fee/edit-fee-structure/" + id);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isLoading && (
        <div id="myModal" className={styles.modal}>
          <div className={styles.loader}>
            <RotatingLines
              strokeColor="#4a4a4b"
              strokeWidth="3"
              animationDuration="0.75"
              width="50"
              visible={isLoading}
            />
          </div>
        </div>
      )}

      {isOpen && pdfUrl && (
        <div id="myModal" className={styles.modal}>
          <div className={styles["modal-content"]}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <iframe
              src={pdfUrl}
              title="fee-structure-pdf"
              style={{ width: "100%", height: "90vh" }}
            ></iframe>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles["btn-container"]}>
          <div className={styles.create}>
            <Link to="/fee/fee-structure">CREATE</Link>
          </div>
        </div>
      </div>
      <Grid className={styles.container} style={{ minHeight: "85vh" }}>
        <Card>
          <CardHeader subheader="Fee Structure" title="Fee Structure List" />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table
                className={styles["table"]}
                stickyHeader
                size="small"
                aria-label="sticky table"
                sx={{ minWidth: 800 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Standard</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feeStructure?.length > 0 ? (
                    feeStructure?.map((data, idx) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={data._id}
                        >
                          <TableCell>{index + idx}</TableCell>
                          <TableCell>{data?.standard?.standard}</TableCell>
                          <TableCell>
                            <List sx={{ padding: "0px" }}>
                              {data?.section?.map((sec) => {
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
                              <DeleteIcon className={styles["delete-button"]} />
                            </IconButton>
                            <IconButton onClick={() => editHandler(data._id)}>
                              <BorderColorIcon />
                            </IconButton>
                            <IconButton onClick={() => generatePDF(data._id)}>
                              <PictureAsPdfIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                        No Data Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[20, 50, 100]}
              component="div"
              count={page.totaltems || 0}
              rowsPerPage={rowsPerPage}
              page={page?.currentPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default FeeStructureList;
