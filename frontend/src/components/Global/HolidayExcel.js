import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import styles from "../Student/StudentList.module.css";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import instance from "../../util/axios/config";

const ExcelExport = ({ searchQuery }) => {
  const [data, setData] = useState();

  const fetchStudent = async () => {
    try {
      const response = await instance.get(
        "/student/allstudent?search=" + JSON.stringify(searchQuery)
      );

      if (response) {
        setData(response?.data?.data);
      }
    } catch (error) {
      if (
        error?.response.data.status === 401 ||
        error?.response.data.status === 500
      ) {
        toast.error("Please login again!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(error?.response.data.message || "Something went wrong", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      handleExport().then((url) => {
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", "student_List.xlsx");
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    }
  }, [data]);

  const createDownloadData = async () => {
    await fetchStudent();
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  };

  const workbook2blob = (workbook) => {
    const wopts = {
      bookType: "xlsx",
      bookSST: false,
      type: "binary",
    };

    const wboutput = XLSX.write(workbook, wopts);

    const blob = new Blob([s2ab(wboutput)], {
      type: "application/octet-stream",
    });

    return blob;
  };

  const handleExport = () => {
    const title = [{ A: "Holiday List - 2023-2024" }, {}];

    let table = [
      {
        A: "Sl No.",
        B: "Title",
        C: "User Type",
        D: "Standard",
        E: "Section",
        F: "Roll No",
        G: "Name",
        H: "Father Name",
        I: "Mother Name",
        J: "Date Of Birth",
        K: "Cast",
        L: "Gender",
        M: "Religion",
        N: "Blood Group",
        O: "Mother Tongue",
        P: "Identification marks",
        Q: "Mobile No",
        R: "Email Id",
        S: "School Name",
        T: "Board",
        U: "Previous Standard",
        V: "Passing Year",
        W: "Total Marks",
        X: "Total Obtained Marks",
        Y: "Percentage/CGPA",
        Z: "Correspondence Address",
        AA: "Permnent Address",
        AB: "District",
        AC: "Pin Code",
        AD: "City",
        AE: "Locality",
        AF: "State",
        AG: "Nationality",
      },
    ];

    data.forEach((rows, index) => {
      table.push({
        A: index + 1,
        B: rows.admissionNo,
        C: rows.admissionDate,
        D: rows.standard?.standard,
        E: rows.section?.section,
        F: rows?.rollNo,
        G: `${rows?.salutation} ${rows?.firstName} ${rows?.middleName} ${rows?.lastName}`,
        H: rows?.fatherName,
        I: rows.motherName,
        J: rows.dateOfBirth,
        K: rows.cast,
        L: rows.gender,
        M: rows.religion,
        N: rows.bloodGroup,
        O: rows.motherTongue,
        P: rows.identificationMarks,
        Q: rows.mobileNo,
        R: rows.email,
        S: rows.schoolName,
        T: rows.board,
        U: rows.previousStandard,
        V: rows.passingYear,
        W: rows.totalMarks,
        X: rows.obtainedMarks,
        Y: rows.percentageCGPA,
        Z: rows.correspondenceAdd,
        AA: rows.permanentAdd,
        AB: rows.district,
        AC: rows.pinCode,
        AD: rows.city?.name,
        AE: rows.locality?.name,
        AF: rows.state?.name,
        AG: rows.nationality,
      });
    });

    // table = [{ A: "Student Details" }].concat(table);
    const finalData = [...title, ...table];

    // console.log(table);
    // console.log(finalData);

    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, sheet, "holiday_List");

    const workbookBlob = workbook2blob(wb);

    var headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Sl No." ? headerIndexes.push(index) : null
    );

    const dataInfo = {
      titleCell: "A2",
      titleRange: "A1:AG2",
      tbodyRange: `A3:AG${finalData.length}`,
      theadRange:
        headerIndexes?.length >= 1
          ? `A${headerIndexes[0] + 1}:AG${headerIndexes[0] + 1}`
          : null,
    };

    return addStyle(workbookBlob, dataInfo);
  };

  const addStyle = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.usedRange().style({
          fontFamily: "Arial",
          verticalAlignment: "center",
        });

        sheet.column("A").width(10);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(15);
        sheet.column("F").width(20);
        sheet.column("G").width(20);
        sheet.column("H").width(20);
        sheet.column("I").width(25);
        sheet.column("J").width(15);
        sheet.column("K").width(15);
        sheet.column("L").width(15);
        sheet.column("M").width(15);
        sheet.column("N").width(15);
        sheet.column("O").width(20);
        sheet.column("P").width(15);
        sheet.column("Q").width(15);
        sheet.column("R").width(25);
        sheet.column("S").width(20);
        sheet.column("T").width(25);
        sheet.column("U").width(15);
        sheet.column("V").width(15);
        sheet.column("W").width(20);
        sheet.column("X").width(25);
        sheet.column("Y").width(25);
        sheet.column("Z").width(15);
        sheet.column("AA").width(15);
        sheet.column("AB").width(15);
        sheet.column("AC").width(15);
        sheet.column("AD").width(15);
        sheet.column("AE").width(15);
        sheet.column("AF").width(15);
        sheet.column("AG").width(15);

        sheet.range(dataInfo.titleRange).merged(true).style({
          bold: true,
          horizontalAlignment: "center",
          verticalAlignment: "center",
        });

        if (dataInfo.tbodyRange) {
          sheet.range(dataInfo.tbodyRange).style({
            horizontalAlignment: "center",
          });
        }

        sheet.range(dataInfo.theadRange).style({
          bold: true,
          horizontalAlignment: "center",
        });

        // if (dataInfo.tFirstColumnRange) {
        //   sheet.range(dataInfo.tFirstColumnRange).style({
        //     bold: true,
        //   });
        // }

        // if (dataInfo.tLastColumnRange) {
        //   sheet.range(dataInfo.tLastColumnRange).style({
        //     bold: true,
        //   });
        // }
      });

      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  return (
    <div className={styles["excle-btn"]}>
      <Button
        color="success"
        variant="contained"
        sx={{ fontWeight: "bold", marginLeft: "auto" }}
        onClick={() => createDownloadData()}
        style={{ paddingTop: "8px", paddingBottom: "8px", marginRight: "15px" }}
      >
        Export
      </Button>
    </div>
  );
};

export default ExcelExport;
