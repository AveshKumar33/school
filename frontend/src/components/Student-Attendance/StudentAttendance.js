import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Autocomplete,
  TextField,
} from "@mui/material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import useHttpErrorHandler from "../../hooks/useHttpErrorHandler";
import instance from "../../util/axios/config";
import TableSkeleton from "../UI/Skeleton";
import { authActions } from "../../redux/auth-slice";
import styles from "./styles.module.css";
import { fetchData } from "../../redux/http-slice";
import RowData from "./RowData";

const StudentAttendance = () => {
  const [standardData, setStandardData] = useState();
  const [sectionData, setSectionData] = useState();
  const [studentData, setStudentData] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const httpErrorHandler = useHttpErrorHandler();
  let count = 1;

  const dispatch = useDispatch();
  const { data, Loading } = useSelector((state) => state.httpRequest);

  useEffect(() => {
    const path = `/standard/all/api`;
    const fetchAccountGroup = async () => {
      try {
        await dispatch(fetchData({ path })).unwrap();
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
  }, [dispatch]);

  useEffect(() => {
    if (!Loading && data) {
      setStandardData(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Loading, data]);

  useEffect(() => {
    setSelectedSection(null);
    setSectionData(selectedStandard?.sections);
  }, [selectedStandard]);

  const handleGetClick = async () => {
    setIsLoading(true);
    if (selectedStandard || selectedSection) {
      const searchData = {
        standard: selectedStandard?._id,
        section: selectedSection?._id,
      };
      try {
        const path = `/student-attend?flterData=${JSON.stringify(searchData)}`;
        const response = await instance.get(path);
        if (response) {
          setStudentData(response.data.data);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        httpErrorHandler(error);
      }
    }
  };

  return (
    <>
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            //   subheader="Select Standard and Section"
            title="Student Attendance"
          />
          <Divider />
          <CardContent>
            <Grid container spacing={2} wrap="wrap">
              <Grid item md={4} sm={6} xs={12}>
                <Autocomplete
                  size="small"
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={standardData || []}
                  value={selectedStandard || null}
                  getOptionLabel={(standardData) => standardData?.standard}
                  isOptionEqualToValue={(option, value) =>
                    option?._id === value?._id
                  }
                  onChange={(event, value) => {
                    setSelectedStandard(value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Standard" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.standard, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.standard, matches);

                    return (
                      <li {...props} key={option?._id}>
                        <div>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{
                                fontWeight: part.highlight ? 700 : 400,
                              }}
                            >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      </li>
                    );
                  }}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Autocomplete
                  size="small"
                  id="highlights-demo"
                  sx={{ width: "100%" }}
                  style={{ width: "100%" }}
                  options={sectionData || []}
                  value={selectedSection || null}
                  getOptionLabel={(sectionData) => sectionData?.section}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onChange={(event, value) => {
                    setSelectedSection(value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Section" />
                  )}
                  renderOption={(props, option, { inputValue }) => {
                    const matches = match(option?.section, inputValue, {
                      insideWords: true,
                    });
                    const parts = parse(option?.section, matches);

                    return (
                      <li {...props} key={option?._id}>
                        <div>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{
                                fontWeight: part.highlight ? 700 : 400,
                              }}
                            >
                              {part.text}
                            </span>
                          ))}
                        </div>
                      </li>
                    );
                  }}
                />
              </Grid>
              <Grid item md={4} sm={6} xs={12}>
                <Button variant="contained" onClick={handleGetClick}>
                  Get
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid className={styles.container}>
        <Card>
          <CardHeader
            subheader="Today Student Attendaance"
            title={"Date:- " + moment(studentData?.date).format("DD-MM-YYYY")}
          />
          <Divider />
          <CardContent>
            {!isLoading ? (
              <TableContainer>
                <Table
                  sx={{ minWidth: 1190 }}
                  className={styles["table"]}
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell className={styles["bold-cell"]}>#</TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Name
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Mobile
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Attendance
                      </TableCell>
                      <TableCell align="left" className={styles["bold-cell"]}>
                        Remark
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentData && studentData?.length > 0 ? (
                      studentData?.map((student) =>
                        student?.attendance.map((row, indx) => (
                          <RowData
                            key={row?._id}
                            row={row}
                            standard={selectedStandard}
                            section={selectedSection}
                            indx={count++}
                          />
                        ))
                      )
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
        </Card>
      </Grid>
    </>
  );
};

export default StudentAttendance;
