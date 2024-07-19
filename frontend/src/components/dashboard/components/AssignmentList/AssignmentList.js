import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";

// import { RotatingLines } from "react-loader-spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  Button,
} from "@mui/material";

import { authActions } from "../../../../redux/auth-slice";
import useHttpErrorHandler from "../../../../hooks/useHttpErrorHandler";
import { fetchDataById, viewFile } from "../../../../redux/http-slice";
import { removeAssignment } from "../../../../redux/assignment-slice";
import Modal from "../../../UI/Modal";
import styles from "./Styles.module.css";

const AssignmentList = () => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null);

  const handleHttpError = useHttpErrorHandler();

  const { dataById, fileUrl } = useSelector((state) => state.httpRequest);

  const user = useSelector((state) => state.auth.user);

  const teacherId = user?._id;

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        await dispatch(
          fetchDataById({ path: "/assignment", id: teacherId })
        ).unwrap();
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
    fetchAssignment();
  }, [dispatch, teacherId]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // delete confirmation modal
  const handleRemoveHandler = (assignmentId) => {
    setIsModalOpen(true);
    setAssignmentIdToDelete(assignmentId);
  };

  // delete confirmation handler modal
  const handleConfirmDeleteHandler = async () => {
    try {
      const data = {
        teacherId: teacherId,
        assignmentId: assignmentIdToDelete,
      };

      await dispatch(removeAssignment(data)).unwrap();
      setIsModalOpen(false);
      dispatch(fetchDataById({ path: "/assignment", id: teacherId })).unwrap();
    } catch (error) {
      handleHttpError(error);
      setIsModalOpen(false);
    }
  };

  const handleViewClick = async (filename) => {
    try {
      dispatch(
        viewFile({ path: "/assignment/file", filename: filename })
      ).unwrap();
      setIsViewModalOpen(true);
    } catch (error) {
      handleHttpError(error);
      setIsViewModalOpen(false);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
  };

  return (
    <>
      {/* {Loading && fileUrl === null && (
        <Modal>
          <div className={styles.loader}>
            <RotatingLines
              strokeColor="#4a4a4b"
              strokeWidth="3"
              animationDuration="0.75"
              width="50"
              visible={Loading}
            />
          </div>
        </Modal>
      )} */}

      {isModalOpen && (
        <Modal>
          <div style={{ textAlign: "center" }}>
            <Typography color="error" component="h2" variant="h6">
              Delete Assignment
            </Typography>
            <p
              style={{
                fontSize: "16px",
                lineHeight: "18px",
                marginBottom: "10px",
              }}
            >
              Are you sure you want <br />
              to Assignment
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

      {isViewModalOpen && (
        <Modal>
          <span className={styles.close} onClick={closeViewModal}>
            &times;
          </span>
          {fileName.endsWith(".pdf") ? (
            <iframe
              title="Assignment PDF"
              src={fileUrl}
              width="500px"
              height="500px"
            ></iframe>
          ) : fileName.endsWith(".jpg") ||
            fileName.endsWith(".jpeg") ||
            fileName.endsWith(".png") ? (
            <img src={fileUrl} alt="Assignment" style={{ maxWidth: "500px" }} />
          ) : fileName.endsWith(".doc") || fileName.endsWith(".docx") ? (
            <iframe
              title="Assignment Word"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(
                fileUrl
              )}&embedded=true`}
              // src={fileUrl}
              width="500px"
              height="50000px"
            ></iframe>
          ) : fileName.endsWith(".xls") || fileName.endsWith(".xlsx") ? (
            <iframe
              title="Assignment Excel"
              src={fileUrl}
              width="500px%"
              height="500px"
            ></iframe>
          ) : (
            <div>File type not supported</div>
          )}
        </Modal>
      )}
      <TableContainer>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Recent Assignment
        </Typography>
        <Table sx={{ minWidth: 680 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Standard</TableCell>
              <TableCell align="left">Section</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataById &&
            dataById.assignment &&
            dataById.assignment.length > 0 ? (
              dataById.assignment.map((row, index) => (
                <TableRow
                  key={row?._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="left">
                    {row?.standardId?.standard}
                  </TableCell>
                  <TableCell align="left">
                    {row?.sectionId?.map((sec) => sec?.section).join(", ")}
                  </TableCell>
                  <TableCell align="left">
                    {moment(row?.addedAt).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="left">
                    <Button
                      variant="text"
                      onClick={() => {
                        handleViewClick(row?.name);
                        setFileName(row?.name);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => handleRemoveHandler(row?._id)}
                    >
                      Remove
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
    </>
  );
};

export default AssignmentList;
