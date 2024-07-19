import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";
import { ThreeDots } from "react-loader-spinner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Grid,
  Divider,
} from "@mui/material";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import useHttpErrorHandler from "../../../hooks/useHttpErrorHandler";
import { postData } from "../../../redux/http-slice";
import { authActions } from "../../../redux/auth-slice";
import instance from "../../../util/axios/config";
import classes from "../styles.module.css";

const Marks = ({
  student,
  index,
  examPaperMap,
  exam,
  session,
  expanded,
  handleChange,
}) => {
  const [data, setData] = useState({ studentData: {} });
  const [resultData, setResultData] = useState();
  const [loading, setLoading] = useState(false);
  const [formValid, setFormValid] = useState(true);

  const dispatch = useDispatch();
  const httpErrorHandler = useHttpErrorHandler();

  const fetchData = async (studentId) => {
    try {
      setLoading(true);
      const selectedExam = exam?.split("_");

      const searchData = {
        session: session,
        student: studentId,
        examName: selectedExam[0],
        examType: selectedExam[1],
      };

      const marksResponse = await instance.get(
        "/marks/all?search=" + JSON.stringify(searchData)
      );

      const studentMarks = marksResponse?.data?.data || [];

      if (studentMarks.length > 0) {
        const {
          totalMarks,
          marks,
          student,
          examType,
          examName,
          standard,
          section,
        } = studentMarks[0];
        setResultData((prevState) => ({
          ...prevState,
          session: session,
          examType: examType?._id,
          examName: examName?._id,
          standard: standard?._id,
          section: section?._id,
          student: student?._id,
          totalMarks,
          marks,
        }));

        setData((prevData) => ({ ...prevData, studentData: student }));

        setLoading(false);
        return;
      }

      const {
        data: { data = [] },
      } = await instance.get("/student/" + studentId);

      const student = data[0];
      const paperData = examPaperMap;

      const paperDetailsMap = new Map();
      paperData.forEach((paper) => {
        if (
          selectedExam[0] === paper?.examName?._id &&
          selectedExam[1] === paper?.examType?._id
        )
          paperDetailsMap.set(paper.paper?._id, {
            minMarks: paper.minMarks,
            maxMarks: paper.maxMarks,
            weightage: paper.weightage,
          });
      });

      let allPapers = [...student?.paper];

      if (student?.additionalPaper) {
        allPapers = [...allPapers, ...student?.additionalPaper];
      }

      const paperMarksDetails = [];

      const marksData = {
        session: session,
        student: student?._id,
        standard: student?.standard?._id,
        section: student?.section?._id,
        examName: selectedExam[0],
        examType: selectedExam[1],
        totalMarks: "",
        marks: [],
      };

      allPapers.forEach((paper) => {
        const paperId = paper?._id;
        const paperDetails = paperDetailsMap?.get(paperId);
        if (paperDetails) {
          paperMarksDetails.push({
            paperId: paperId,
            paperName: paper.paper,
            minMarks: paperDetails.minMarks,
            maxMarks: paperDetails.maxMarks,
            weightage: paperDetails.weightage,
          });
          marksData.marks.push({
            paperId: paperId,
            paperName: paper.paper,
            obtainedMarks: "",
            obtainedGrade: "",
            remarks: "",
            total: 0,
            minMarks: paperDetails.minMarks,
            maxMarks: paperDetails.maxMarks,
            weightage: paperDetails.weightage,
          });
        }
      });

      setResultData(marksData);

      const studentPapers = {
        ...student,
        paper: paperMarksDetails,
      };

      setData((prevData) => ({
        ...prevData,
        studentData: studentPapers,
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if ([401, 500].includes(error?.response?.data?.status)) {
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
  };

  const handleClick = (studentId) => {
    if (studentId !== resultData?.student) {
      fetchData(studentId);
    }
  };

  const handleInputChange = (event, studentId, paperId, index) => {
    if (studentId === resultData?.student) {
      const updatedMarks = resultData.marks.map((item, idx) => {
        if (idx === index && item.paperId === paperId) {
          return {
            ...item,
            [event.target.name]: event.target.value,
          };
        }
        return item;
      });

      const totalObtainedMarks = updatedMarks.reduce((total, marks) => {
        return total + Number(marks.obtainedMarks);
      }, 0);

      setResultData((prevResultData) => ({
        ...prevResultData,
        totalMarks: totalObtainedMarks,
        marks: updatedMarks,
      }));
    }
  };

  const handleMarksSubmit = async () => {
    try {
      if (formValid) {
        await dispatch(postData({ path: "/marks", data: resultData })).unwrap();
      } else {
        toast.error("Please fill correct data!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      httpErrorHandler(error);
    }
  };

  return (
    <>
      <Accordion
        key={student?._id}
        expanded={expanded}
        onChange={handleChange(student?._id)}
        onClick={() => {
          handleClick(student?._id);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{ backgroundColor: "#7b1fa2" }}
        >
          <Typography
            sx={{
              width: "33%",
              flexShrink: 0,
              fontSize: "1rem",
              color: "#fff",
            }}
          >
            {`${index + 1}. ${student?.firstName} ${student?.middleName} ${
              student?.lastName
            }`}
          </Typography>
        </AccordionSummary>
        {!loading ? (
          <AccordionDetails>
            <Grid
              container
              spacing={2}
              wrap="wrap"
              className={classes.container}
            >
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Name:
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {`${data?.studentData?.firstName} ${data?.studentData?.middleName} ${data?.studentData?.lastName}`}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Class:
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {`${data?.studentData?.standard?.standard} - (${data?.studentData?.section?.section})`}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Date Of Birth:
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {moment(data?.studentData?.dateOfBirth).format("DD-MM-YYYY")}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Roll No:
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {data?.studentData?.rollNo}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Father Name:
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {data?.studentData?.fatherName}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Reg. No:
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {data?.studentData?.registrationNo}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ margin: "10px" }} />
            <TableContainer>
              <Table sx={{ minWidth: 950 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Paper</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Obtain Marks
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Obtain Grade
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Max Marks</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Min Marks</TableCell>
                    {/* <TableCell sx={{ fontWeight: "bold" }}>
                            Max User Marks
                          </TableCell> */}
                    <TableCell sx={{ fontWeight: "bold" }}>Weightage</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultData?.marks?.length > 0 &&
                    resultData?.marks?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item?.paperName || item?.paperId?.paper}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            className={classes.textField}
                            sx={{ backgroundColor: "#f5f5f5" }}
                            error={
                              item?.obtainedMarks > item?.maxMarks
                                ? true
                                : false
                            }
                            id={`${student?._id}_${item?.paperName}_obtainMarks`}
                            type="number"
                            name="obtainedMarks"
                            variant="outlined"
                            value={item?.obtainedMarks || ""}
                            helperText={
                              item?.obtainedMarks > item?.maxMarks
                                ? "Obtained marks is greater than max marks"
                                : ""
                            }
                            onChange={(event) => {
                              handleInputChange(
                                event,
                                student?._id,
                                item?.paperId,
                                index
                              );
                              setFormValid(
                                !(item?.obtainedMarks > item?.maxMarks)
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            className={classes.textField}
                            sx={{ backgroundColor: "#f5f5f5" }}
                            id={`${student?._id}_${item?.paperId}_obtainGrade`}
                            // label="Description"
                            name="obtainedGrade"
                            variant="outlined"
                            value={item?.obtainedGrade || ""}
                            onChange={(event) => {
                              handleInputChange(
                                event,
                                student?._id,
                                item?.paperId,
                                index
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            className={classes.textField}
                            sx={{ backgroundColor: "#f5f5f5" }}
                            id={`${student?._id}_${item?.paperId}_maxMarks`}
                            // label="Description"
                            type="number"
                            name={`maxMarks`}
                            variant="outlined"
                            value={item?.maxMarks || ""}
                            disabled={true}
                            // onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            className={classes.textField}
                            sx={{ backgroundColor: "#f5f5f5" }}
                            id={`${student?._id}_${item?.paperId}_minMarks`}
                            // label="Description"
                            type="number"
                            name={`minMarks`}
                            variant="outlined"
                            value={item?.minMarks === 0 ? 0 : item?.minMarks}
                            disabled={true}
                            // onChange={handleChange}
                          />
                        </TableCell>
                        {/* <TableCell>
                                <TextField
                                  size="small"
                                  className={classes.textField}
                                  sx={{ backgroundColor: "#f5f5f5" }}
                                  id="outlined-basic2"
                                  // label="Description"
                                  type="number"
                                  name="weightage"
                                  variant="outlined"
                                  value={item?.weightage || ""}
                                  disabled={true}
                                  // onChange={handleChange}
                                />
                              </TableCell> */}
                        <TableCell>
                          <TextField
                            size="small"
                            className={classes.textField}
                            sx={{ backgroundColor: "#f5f5f5" }}
                            id={`${student?._id}_${item?.paperId}_weightage`}
                            // label="Description"
                            type="number"
                            name={`weightage`}
                            variant="outlined"
                            value={item?.weightage || 0}
                            disabled={true}
                            // onChange={handleChange}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            className={classes.textField}
                            sx={{ backgroundColor: "#f5f5f5" }}
                            id={`${student?._id}_${item?.paperId}_remarks`}
                            // label="Description"
                            type="text"
                            name={`remark`}
                            variant="outlined"
                            value={item?.description || ""}
                            // {...register("description", {})}
                            onChange={(event) => {
                              handleInputChange(
                                event,
                                student?._id,
                                item?.paperId
                              );
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>{item?.obtainedMarks}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid
              className={classes.container}
              container
              spacing={2}
              wrap="wrap"
            >
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  Accumlated Marks:
                </Typography>
                <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                  {resultData?.totalMarks}
                </Typography>
              </Grid>
              <Grid
                item
                md={6}
                sm={6}
                xs={12}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button variant="contained" onClick={handleMarksSubmit}>
                  Save Marks
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        ) : (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </Grid>
        )}
      </Accordion>
    </>
  );
};

export default Marks;
