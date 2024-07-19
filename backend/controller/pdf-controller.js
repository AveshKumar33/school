const feeRecordController = require("../controller/feeRecordController");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePDF = async (req, res) => {
  // const doc = new PDFDocument({ margins: { bottom: 0 } });
  const doc = new PDFDocument();
  doc.page.size = "A4";

  const backgroundImage = () => {
    doc.image("./public/image/QuotationFormat.png", 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
      opacity: 0.5,
    });
  };

  backgroundImage();

  const writeStream = fs.createWriteStream("test.pdf");
  doc.pipe(writeStream);

  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    const pdfData = Buffer.concat(buffers);
    res.end(pdfData);
  });

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

  // rectWithText(279, 200, 72, 22, "Helvetica-Bold", "Any Text");

  // JSON.parse(req?.query?.search);

  // const pageHeight = doc.page.height;
  // const width = doc.page.width - 40;
  // const pageWidth = doc.page.width;

  // doc
  //   .rect(20, 20, width, pageHeight - 40)
  //   .lineWidth(1)
  //   .strokeColor("#256a98")
  //   .stroke();

  // function pdfBackgroundImage(x = 20, y = 10, copyType) {
  //   doc.image("./public/image/logo.png", x, y, {
  //     fit: [90, 90],
  //   });

  //   doc.image("./public/image/logo.png", pageWidth - 100, y, {
  //     fit: [90, 90],
  //   });

  //   doc
  //     .fontSize(13)
  //     .font("Helvetica-Bold")
  //     .fillColor("#256a98")
  //     .text("SUNRISE PUBLIC SCHOOL", 0, y + 23, {
  //       align: "center",
  //       width: width,
  //     });

  //   doc
  //     .fontSize(10)
  //     .fillColor("#256a98")
  //     .text("Bari-Bajna Road, Mathura - 281004", 0, y + 40, {
  //       align: "center",
  //       width: width,
  //     });

  //   doc
  //     .fontSize(10)
  //     .fillColor("#256a98")
  //     .text("Contact No.- 8477993993", 0, y + 55, {
  //       align: "center",
  //       width: width,
  //     });

  //   doc
  //     .fontSize(13)
  //     .font("Helvetica-Bold")
  //     .fillColor("#256a98")
  //     .text(copyType, 0, y + 80, {
  //       align: "center",
  //       width: width,
  //     });
  // }

  // pdfBackgroundImage(20, 10, "OFFICE COPY");

  // doc.moveTo(240, 103).lineTo(333, 103).lineWidth(1.5).fillAndStroke("#256a98");

  // function pdfStudentDetails(x = 20, y = 115) {
  //   rectWithText(x, y, 75, 22, "Helvetica", "ReceiptNo.");
  //   rectWithText(x + 75, y, 70, 22, "Helvetica", "30");
  //   rectWithText(x + 145, y, 70, 22, "Helvetica", "Date");
  //   rectWithText(x + 215, y, 64, 22, "Helvetica", "23/09/2024");

  //   rectWithText(x + 279, y, 72, 22, "Helvetica", "Session.");
  //   rectWithText(x + 351, y, 70, 22, "Helvetica", "2022-2023");
  //   rectWithText(x + 421, y, 70, 22, "Helvetica", "Class");
  //   rectWithText(x + 491, y, 81, 22, "Helvetica", `GRADE-1 (Section - A)}`);

  //   rectWithText(x, y + 22, 75, 22, "Helvetica", "Name.");
  //   rectWithText(x + 75, y + 22, 204, 22, "Helvetica", "Fee Test");

  //   rectWithText(x + 279, y + 22, 72, 22, "Helvetica", "Roll No.");
  //   rectWithText(x + 351, y + 22, 70, 22, "Helvetica", 23);
  //   rectWithText(x + 421, y + 22, 70, 22, "Helvetica", "Category");
  //   rectWithText(x + 491, y + 22, 81, 22, "Helvetica", "BC-I");

  //   rectWithText(x, y + 44, 75, 22, "Helvetica", "Father Name");
  //   rectWithText(x + 75, y + 44, 204, 22, "Helvetica", "Fee Test");

  //   rectWithText(x + 279, y + 44, 72, 22, "Helvetica", "Address");
  //   rectWithText(x + 351, y + 44, 221, 22, "Helvetica", "Noida Sector - 34");
  // }

  // pdfStudentDetails();

  // const tableData = [["PARTICULARS", "AMOUNT", "PAYABLE AMOUNT", "BALANCE"]];

  // tableData.push(
  //   ["Total", "Col - 1", "Col - 2", "Col - 3"],
  //   ["Total", "Col - 1", "Col - 2", "Col - 3"],
  //   ["Total", "Col - 1", "Col - 2", "Col - 3"],
  //   ["Total", "Col - 1", "Col - 2", "Col - 3"],
  //   ["Total", "Col - 1", "Col - 2", "Col - 3"]
  // );

  // function drawCell(text, x, y, width, cellHeight, textAlign, fortWeight) {
  //   doc.font(fortWeight).fillColor("#000").text(text, x, y, {
  //     width,
  //     height: cellHeight,
  //     align: textAlign,
  //     lineGap: 2,
  //   });
  // }

  // function createTableHeading(
  //   text,
  //   x,
  //   y,
  //   width,
  //   cellHeight,
  //   textAlign,
  //   fortWeight
  // ) {
  //   doc.font(fortWeight).fillColor("#000").fill().text(text, x, y, {
  //     width,
  //     height: cellHeight,
  //     align: textAlign,
  //     lineGap: 2,
  //   });
  // }

  // const cellHeight = 22;
  // let rowsPerPage = Math.floor(pageHeight / cellHeight);
  // let totalPages = Math.ceil(tableData.length / rowsPerPage);
  // // doc.fontSize(10).text(`Page ${0 + 1} of ${totalPages}`, 540, pageHeight - 15);
  // let lastPageTableHeight = 0;
  // let currentPage = 0;

  // function CreateTable(
  //   pageWidth,
  //   tableX = 20,
  //   tableY = 200,
  //   cellMargin = 20,
  //   fontSize = 10
  // ) {
  //   let tableYHeight = tableY;
  //   const columnWidths = [30, 25, 25, 20]; // Define your column widths here
  //   const totalWidth = pageWidth - 1.5 * tableX;
  //   const totalPercentage = columnWidths.reduce((sum, width) => sum + width, 0);
  //   const columnWidthFactors = columnWidths.map(
  //     (width) => (width / totalPercentage) * totalWidth
  //   );
  //   let currentRow = 0;

  //   doc.fontSize(fontSize);

  //   while (currentRow < tableData.length) {
  //     if (tableYHeight + cellHeight > pageHeight - 20) {
  //       doc.addPage();
  //       lastPageTableHeight = 0;
  //       tableY = 20;
  //       tableYHeight = 20;
  //       currentPage++;
  //     }
  //     lastPageTableHeight += 22;
  //     const rowData = tableData[currentRow];
  //     const cellY = tableYHeight;

  //     for (let j = 0; j < rowData.length; j++) {
  //       const cellText = rowData[j];
  //       const cellX =
  //         tableX +
  //         columnWidthFactors.slice(0, j).reduce((sum, width) => sum + width, 0);

  //       doc
  //         .rect(cellX - 0.3, cellY, columnWidthFactors[j], cellHeight)
  //         .lineWidth(1)
  //         .strokeColor("#256a98")
  //         .stroke();

  //       if (currentRow === tableData.length - 1) {
  //         doc
  //           .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
  //           .lineWidth(1)
  //           .fillColor("#e0e0e0")
  //           .fill();

  //         doc
  //           .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
  //           .lineWidth(1)
  //           .strokeColor("FFFFFF")
  //           .stroke();

  //         // drawCell(
  //         //   cellText,
  //         //   cellX + 7,
  //         //   cellY + 7,
  //         //   columnWidthFactors[j] - 10,
  //         //   cellHeight,
  //         //   "right",
  //         //   "Helvetica"
  //         // );
  //       }

  //       if (currentRow >= 1 && j === 0) {
  //         if (currentRow === tableData.length - 1) {
  //           drawCell(
  //             cellText,
  //             cellX + 7,
  //             cellY + 7,
  //             columnWidthFactors[j] - 10,
  //             cellHeight,
  //             "left",
  //             "Helvetica-Bold"
  //           );
  //         } else {
  //           drawCell(
  //             cellText,
  //             cellX + 7,
  //             cellY + 7,
  //             columnWidthFactors[j] - 10,
  //             cellHeight,
  //             "left",
  //             "Helvetica"
  //           );
  //         }
  //       }

  //       if (currentRow === 0) {
  //         doc
  //           .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
  //           .lineWidth(1)
  //           .fillColor("#e0e0e0")
  //           .fill();

  //         doc
  //           .rect(cellX - 0.1, cellY, columnWidthFactors[j], cellHeight)
  //           .lineWidth(1)
  //           .strokeColor("FFFFFF")
  //           .stroke();

  //         createTableHeading(
  //           cellText,
  //           cellX + 5,
  //           cellY + 8,
  //           columnWidthFactors[j] - 10,
  //           cellHeight,
  //           "center",
  //           "Helvetica-Bold"
  //         );
  //       }
  //       if (currentRow >= 1 && (j === 1 || j === 2 || j === 3)) {
  //         if (currentRow === tableData.length - 1) {
  //           drawCell(
  //             cellText,
  //             cellX + 7,
  //             cellY + 7,
  //             columnWidthFactors[j] - 10,
  //             cellHeight,
  //             "right",
  //             "Helvetica-Bold"
  //           );
  //         } else {
  //           drawCell(
  //             cellText,
  //             cellX + 7,
  //             cellY + 7,
  //             columnWidthFactors[j] - 10,
  //             cellHeight,
  //             "right",
  //             "Helvetica"
  //           );
  //         }
  //       }
  //     }

  //     tableYHeight += cellHeight;
  //     currentRow++;
  //   }
  // }

  // CreateTable(pageWidth - 10);

  // function slipFooter(x = 20, y = lastPageTableHeight) {
  //   doc
  //     .fontSize(13)
  //     .font("Helvetica")
  //     .text("Issued By", x + 25, y + 50, {
  //       align: "left",
  //       width: width,
  //     });

  //   doc
  //     .moveTo(x + 10, y + 45)
  //     .lineTo(x + 100, y + 45)
  //     .lineWidth(1)
  //     .fillAndStroke("#121212");

  //   doc
  //     .fontSize(13)
  //     .font("Helvetica")
  //     .text("Posted By", 0, y + 50, {
  //       align: "center",
  //       width: width,
  //     });

  //   doc
  //     .moveTo(x + 220, y + 45)
  //     .lineTo(x + 313, y + 45)
  //     .lineWidth(1)
  //     .fillAndStroke("#121212");

  //   doc
  //     .fontSize(13)
  //     .font("Helvetica")
  //     .text("Verified By", 0, y + 50, {
  //       align: "right",
  //       width: width,
  //     });

  //   doc
  //     .moveTo(x + 472, y + 45)
  //     .lineTo(x + 565, y + 45)
  //     .lineWidth(1)
  //     .fillAndStroke("#121212");
  // }

  // slipFooter(20, lastPageTableHeight + 200);

  doc.addPage();
  backgroundImage();

  // rectWithText(279, 200, 72, 22, "Helvetica-Bold", "Any Text");

  doc.end();

  writeStream.on("finish", () => {
    console.log("PDF generated successfully!");
  });

  res.send("working");
};

module.exports = { generatePDF };
