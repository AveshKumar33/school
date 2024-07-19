const feeRecordController = require("../controller/feeRecordController");
const schoolDetailsModel = require("../schema/school-details-schema");
const schoolDetailsController = require("../controller/schoolDetailsController");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const feeVoucherPdf = async (req, res) => {
  const searchData = JSON.parse(req?.query?.search);

  const feeData = await feeRecordController.pdfLogData(req, searchData);
  const schoolData = await schoolDetailsController.schoolDetails(req);

  const initialValues = {
    feeTableData: [],
    receiptNo: null,
    date: null,
    session: null,
    studentName: null,
    castCategory: null,
    rollNo: null,
    standard: null,
    section: null,
    fatherName: "",
    address: "",
    sumOfFee: 0,
    sumOfRemainingAmount: 0,
    sumOfPayableAmount: 0,
    isCancel: false,
  };

  const imagePath = path.join(
    __dirname,
    "../upload",
    "School",
    schoolData?.logo
  );

  feeData.forEach((curr) => {
    const {
      feeHead,
      month,
      fee,
      isPreviousBalance,
      log,
      session,
      student,
      incrementedAmount,
      standard,
      section,
    } = curr;

    const feeHeadName = feeHead?.name ?? "N/A";
    const sessionName = session?.name ?? "N/A";
    const castCategoryName = student?.castCategory?.name ?? "N/A";
    const fatherName = student?.fatherName ?? "N/A";
    const rollNo = student?.rollNo ?? "N/A";
    const firstName = student?.firstName ?? "N/A";
    const middleName = student?.middleName ?? "N/A";
    const lastName = student?.lastName ?? "N/A";
    const correspondenceAdd = student?.correspondenceAdd ?? "N/A";
    const logDate = log?.date ?? "N/A";
    const voucherGeneratedDate = log?.voucherGeneratedDate ?? "N/A";
    const logReceiptNo = log?.receiptNo ?? "N/A";
    const isCancel = log?.isCancel ?? "N/A";

    const feeHeadHeading = isPreviousBalance
      ? `${feeHeadName} (Previous Session Balance)`
      : `${feeHeadName} (${month || "N/A"})`;

    initialValues.feeTableData.push([
      feeHeadHeading,
      log?.payableAmount ?? "N/A",
    ]);

    initialValues.date = logDate;
    initialValues.voucherGeneratedDate = voucherGeneratedDate;
    initialValues.isCancel = isCancel;
    initialValues.receiptNo = logReceiptNo;
    initialValues.session = sessionName;
    initialValues.castCategory = castCategoryName;
    initialValues.fatherName = fatherName;
    initialValues.rollNo = rollNo;
    initialValues.standard = standard?.standard ?? "N/A";
    initialValues.section = section?.section ?? "N/A";
    initialValues.address = correspondenceAdd;
    initialValues.studentName = `${firstName} ${middleName} ${lastName}`;
    initialValues.sumOfFee = fee + incrementedAmount ?? 0;
    initialValues.sumOfRemainingAmount += log?.remainingAmount ?? 0;
    initialValues.sumOfPayableAmount += log?.payableAmount ?? 0;
  });

  const doc = new PDFDocument({ margins: { bottom: 0 } });

  function cancelledSlip(x = 50, y = 375, width = pageWidth) {
    const diagonalText = "CANCELLED";
    const textWidth = doc.widthOfString(diagonalText);
    const textHeight = doc.currentLineHeight();

    doc.save();

    doc.translate(x, y);
    doc.rotate(-40);

    doc
      .fontSize(40)
      .font("Helvetica-Bold")
      .fillColor("#e27f7f")
      .text(diagonalText, -(textWidth / 2), -(textHeight / 2), {
        align: "center",
        width: width,
        zIndex: 100,
      });

    doc.restore(); // Restore the saved transformation matrix
  }

  const rectWithText = (startX, startY, width, height, font, text) => {
    doc
      .rect(startX, startY, width, height, font)
      .lineWidth(1)
      .strokeColor("#256a98")
      .stroke();

    const textX = startX + 7;
    const textY = startY + 7;

    doc.fontSize(10).fillColor("#000").font(font).text(text, textX, textY, {
      width: doc.page.width,
    });
  };

  const writeStream = fs.createWriteStream("test.pdf");
  doc.pipe(writeStream);

  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.end(pdfData);
  });

  const pageHeight = doc.page.height;
  const width = doc.page.width - 40;
  const pageWidth = doc.page.width;

  doc
    .rect(20, 20, width, pageHeight - 40)
    .lineWidth(1)
    .strokeColor("#256a98")
    .stroke();

  function pdfHeader(x = 20, y = 10, copyType) {
    doc.image(imagePath, x, y, {
      fit: [80, 80],
    });

    doc.image(imagePath, pageWidth - 110, y, {
      fit: [80, 80],
    });

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#256a98")
      .text(schoolData?.name, 0, y + 23, {
        align: "center",
        width: width,
      });

    doc
      .fontSize(10)
      .fillColor("#256a98")
      .text(schoolData?.address, 0, y + 40, {
        align: "center",
        width: width,
      });

    doc
      .fontSize(10)
      .fillColor("#256a98")
      .text(`Contact No.- ${schoolData?.address}`, 0, y + 55, {
        align: "center",
        width: width,
      });

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#256a98")
      .text(copyType, 0, y + 80, {
        align: "center",
        width: width,
      });
  }

  pdfHeader(30, 25, "OFFICE COPY");

  doc.moveTo(240, 103).lineTo(333, 103).lineWidth(1.5).fillAndStroke("#256a98");

  // OFFICE COPY student details

  function pdfStudentDetails(x = 20, y = 115) {
    rectWithText(x, y, 75, 22, "Helvetica", "ReceiptNo.");
    rectWithText(x + 75, y, 70, 22, "Helvetica", initialValues?.receiptNo);
    rectWithText(x + 145, y, 70, 22, "Helvetica", "Date");
    rectWithText(
      x + 215,
      y,
      64,
      22,
      "Helvetica",
      moment(initialValues?.voucherGeneratedDate).format("DD/MM/YYYY")
    );

    rectWithText(x + 279, y, 72, 22, "Helvetica", "Session.");
    rectWithText(x + 351, y, 70, 22, "Helvetica", initialValues.session);
    rectWithText(x + 421, y, 70, 22, "Helvetica", "Class");
    rectWithText(
      x + 491,
      y,
      81,
      22,
      "Helvetica",
      `${initialValues.standard} - ${initialValues.section}`
    );

    rectWithText(x, y + 22, 75, 22, "Helvetica", "Name.");
    rectWithText(
      x + 75,
      y + 22,
      204,
      22,
      "Helvetica",
      initialValues.studentName
    );

    rectWithText(x + 279, y + 22, 72, 22, "Helvetica", "Roll No.");
    rectWithText(x + 351, y + 22, 70, 22, "Helvetica", initialValues.rollNo);
    rectWithText(x + 421, y + 22, 70, 22, "Helvetica", "Category");
    rectWithText(
      x + 491,
      y + 22,
      81,
      22,
      "Helvetica",
      initialValues.castCategory
    );

    rectWithText(x, y + 44, 75, 22, "Helvetica", "Father Name");
    rectWithText(
      x + 75,
      y + 44,
      204,
      22,
      "Helvetica",
      initialValues.fatherName
    );

    rectWithText(x + 279, y + 44, 72, 22, "Helvetica", "Address");
    rectWithText(x + 351, y + 44, 221, 22, "Helvetica", initialValues.address);
  }

  pdfStudentDetails();

  const tableData = [["PARTICULARS", "PAYABLE AMOUNT"]];

  tableData.push(...initialValues.feeTableData, [
    "Total",
    `${initialValues.sumOfPayableAmount}`,
  ]);

  function drawCell(text, x, y, width, cellHeight, textAlign, fortWeight) {
    doc.font(fortWeight).fillColor("#000").text(text, x, y, {
      width,
      height: cellHeight,
      align: textAlign,
      lineGap: 2,
    });
  }

  function createTableHeading(
    text,
    x,
    y,
    width,
    cellHeight,
    textAlign,
    fortWeight
  ) {
    doc.font(fortWeight).fillColor("#000").fill().text(text, x, y, {
      width,
      height: cellHeight,
      align: textAlign,
      lineGap: 2,
    });
  }

  const cellHeight = 22;
  let rowsPerPage = Math.floor(pageHeight / cellHeight);
  let totalPages = Math.ceil(tableData.length / rowsPerPage);
  // doc.fontSize(10).text(`Page ${0 + 1} of ${totalPages}`, 540, pageHeight - 15);
  let lastPageTableHeight = 0;
  let currentPage = 0;

  function CreateTable(
    pageWidth,
    tableX = 20,
    tableY = 200,
    cellMargin = 20,
    fontSize = 10
  ) {
    let tableYHeight = tableY;
    const columnWidths = [70, 20]; // Define your column widths here
    const totalWidth = pageWidth - 1.5 * tableX;
    const totalPercentage = columnWidths.reduce((sum, width) => sum + width, 0);
    const columnWidthFactors = columnWidths.map(
      (width) => (width / totalPercentage) * totalWidth
    );
    let currentRow = 0;

    doc.fontSize(fontSize);

    while (currentRow < tableData.length) {
      if (tableYHeight + cellHeight > pageHeight - 20) {
        doc.addPage();
        lastPageTableHeight = 0;
        tableY = 20;
        tableYHeight = 20;
        currentPage++;
      }
      lastPageTableHeight += 22;
      const rowData = tableData[currentRow];
      const cellY = tableYHeight;

      for (let j = 0; j < rowData.length; j++) {
        const cellText = rowData[j];
        const cellX =
          tableX +
          columnWidthFactors.slice(0, j).reduce((sum, width) => sum + width, 0);

        doc
          .rect(cellX - 0.3, cellY, columnWidthFactors[j], cellHeight)
          .lineWidth(1)
          .strokeColor("#256a98")
          .stroke();

        if (currentRow === tableData.length - 1) {
          doc
            .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
            .lineWidth(1)
            .fillColor("#e0e0e0")
            .fill();

          doc
            .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
            .lineWidth(1)
            .strokeColor("FFFFFF")
            .stroke();
        }

        if (currentRow >= 1 && j === 0) {
          if (currentRow === tableData.length - 1) {
            drawCell(
              cellText,
              cellX + 7,
              cellY + 7,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "Helvetica-Bold"
            );
          } else {
            drawCell(
              cellText,
              cellX + 7,
              cellY + 7,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "Helvetica"
            );
          }
        }

        if (currentRow === 0) {
          doc
            .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
            .lineWidth(1)
            .fillColor("#e0e0e0")
            .fill();

          doc
            .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
            .lineWidth(1)
            .strokeColor("FFFFFF")
            .stroke();

          createTableHeading(
            cellText,
            cellX + 5,
            cellY + 8,
            columnWidthFactors[j] - 10,
            cellHeight,
            "center",
            "Helvetica-Bold"
          );
        }
        if (currentRow >= 1 && (j === 1 || j === 2 || j === 3)) {
          if (currentRow === tableData.length - 1) {
            drawCell(
              cellText,
              cellX + 7,
              cellY + 7,
              columnWidthFactors[j] - 10,
              cellHeight,
              "right",
              "Helvetica-Bold"
            );
          } else {
            drawCell(
              cellText,
              cellX + 7,
              cellY + 7,
              columnWidthFactors[j] - 10,
              cellHeight,
              "right",
              "Helvetica"
            );
          }
        }
      }

      tableYHeight += cellHeight;
      currentRow++;
    }
  }

  CreateTable(pageWidth - 10);
  if (initialValues.isCancel) {
    cancelledSlip();
  }

  function slipFooter(x = 20, y = lastPageTableHeight) {
    doc
      .fontSize(13)
      .font("Helvetica")
      .text("Issued By", x + 25, y + 50, {
        align: "left",
        width: width,
      });

    doc
      .moveTo(x + 10, y + 45)
      .lineTo(x + 100, y + 45)
      .lineWidth(1)
      .fillAndStroke("#121212");

    doc
      .fontSize(13)
      .font("Helvetica")
      .text("Posted By", 0, y + 50, {
        align: "center",
        width: width,
      });

    doc
      .moveTo(x + 220, y + 45)
      .lineTo(x + 313, y + 45)
      .lineWidth(1)
      .fillAndStroke("#121212");

    doc
      .fontSize(13)
      .font("Helvetica")
      .text("Verified By", 0, y + 50, {
        align: "right",
        width: width,
      });

    doc
      .moveTo(x + 472, y + 45)
      .lineTo(x + 565, y + 45)
      .lineWidth(1)
      .fillAndStroke("#121212");
  }

  slipFooter(20, lastPageTableHeight + 200);

  if (lastPageTableHeight >= 111) {
    doc.addPage();
    doc
      .rect(20, 20, width, pageHeight - 40)
      .lineWidth(1)
      .strokeColor("#256a98")
      .stroke();
    lastPageTableHeight = -65;
  } else if (currentPage === 0) {
    lastPageTableHeight += 200;
  }

  // student copy

  doc
    .moveTo(20, lastPageTableHeight + 85)
    .lineTo(pageWidth - 20, lastPageTableHeight + 85)
    .lineWidth(1)
    .fillAndStroke("#256a98");

  pdfHeader(30, lastPageTableHeight + 90, "STUDENT COPY");

  doc
    .moveTo(235, lastPageTableHeight + 168)
    .lineTo(338, lastPageTableHeight + 168)
    .lineWidth(1.5)
    .fillAndStroke("#256a98");

  pdfStudentDetails(20, lastPageTableHeight + 182);

  CreateTable(pageWidth - 10, 20, lastPageTableHeight + 268);

  slipFooter(20, lastPageTableHeight + 270);

  if (initialValues.isCancel) {
    cancelledSlip(50, lastPageTableHeight + 300);
  }

  // Bank Copy

  if (searchData.isBankPaid) {
    doc.addPage();
    doc
      .rect(20, 20, width, pageHeight - 40)
      .lineWidth(1)
      .strokeColor("#256a98")
      .stroke();
    lastPageTableHeight = -65;

    pdfHeader(30, lastPageTableHeight + 95, "BANK COPY");

    doc
      .moveTo(235, lastPageTableHeight + 168)
      .lineTo(338, lastPageTableHeight + 168)
      .lineWidth(1.5)
      .fillAndStroke("#256a98");

    pdfStudentDetails(20, lastPageTableHeight + 182);

    CreateTable(pageWidth - 10, 20, lastPageTableHeight + 268);

    slipFooter(20, lastPageTableHeight + 270);

    if (initialValues.isCancel) {
      cancelledSlip(50, lastPageTableHeight + 300);
    }
  }

  doc.end();
};

module.exports = { feeVoucherPdf };
