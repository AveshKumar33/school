const holidayModel = require("../schema/holiday-schema");
const PDFDocument = require("pdfkit");
const moment = require("moment");

const holidayPdf = async (req, res) => {
  const doc = new PDFDocument({
    margins: { top: 5, bottom: 50, left: 50, right: 50 },
  });

  try {
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.end(pdfData);
    });

    const holiday = await holidayModel
      .find()
      .populate("session")
      .populate("section")
      .populate("standard")
      .populate("userType");

    const holidayTableData = holiday.reduce((acc, curr, index) => {
      const userTypeTitles = curr.userType.map((user) => user.title);
      return [
        ...acc,
        [
          index + 1,
          curr.title,
          userTypeTitles.join(", "),
          moment(curr?.startDate).format("DD/MM/YYYY"),
          moment(curr?.endDate).format("DD/MM/YYYY"),
        ],
      ];
    }, []);

    doc.rect(19, 20, 573, 125).lineWidth(2).strokeColor("#256a98").stroke();

    doc.image("./public/image/logo.png", 1, 5, {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });

    doc.image("./public/image/logo.png", 463, 5, {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#256a98")
      .text("SUNSHINE WORLD SCHOOL (MONTESSORI)", 138, 38, {
        width: doc.page.width,
      });

    doc
      .fontSize(12)
      .fillColor("#256a98")
      .text("An English Medium School Based on CBSE Curriculum", 3, 58, {
        align: "center",
        width: doc.page.width,
      });

    doc
      .fontSize(14)
      .fillColor("#256a98")
      .text("SCHOOL UDISE CODE -1800116200", 3, 75, {
        align: "center",
        width: doc.page.width,
      });

    doc
      .fontSize(12)
      .fillColor("#256a98")
      .text("Add-Ledahi, Mohanpur, Gaya –824201", 3, 93, {
        align: "center",
        width: doc.page.width,
      });

    doc
      .fontSize(14)
      .fillColor("#256a98")
      .text("Contact No.-9262502910, 8292106138", 3, 110, {
        align: "center",
        width: doc.page.width,
      });

    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .fillColor("#256a98")
      .text("Holiday (2023 - 2024)", 3, 157, {
        align: "center",
        width: doc.page.width,
      });

    doc
      .moveTo(225, 175)
      .lineTo(395, 175)
      .lineWidth(1.5)
      .fillAndStroke("#256a98");

    const tableData = [
      ["Sl.No.", "Title", "User Type", "Start Date", "End Date"],
    ];

    tableData.push(...holidayTableData);

    function drawCell(text, x, y, width, cellHeight, textAlign, fortWeight) {
      doc.fillColor("#000");
      doc.font(fortWeight).text(text, x, y, {
        width,
        height: cellHeight,
        align: textAlign,
        lineGap: 2,
      });
    }

    function CreateTable(
      tableX = 20,
      tableY = 190,
      cellMargin = 20,
      fontSize = 10
    ) {
      // Define table data
      let tableYHeight = tableY;
      const columnWidths = [10, 25, 35, 15, 15]; // 30%, 40%, 30%
      const totalWidth = doc.page.width - 2 * tableX;
      const totalPercentage = columnWidths.reduce(
        (sum, width) => sum + width,
        0
      );
      const columnWidthFactors = columnWidths.map((width) => {
        const abc = (width / totalPercentage) * totalWidth;
        return Math.round(abc);
      });

      let cellHeight = 25;

      doc.fontSize(fontSize);

      for (let i = 0; i < tableData.length; i++) {
        if (tableYHeight + cellHeight > doc.page.height) {
          doc.addPage();
          CreateTable(30, 20, 20, 8, [tableData[0], ...tableData.splice(i)]);

          return;
        }

        for (let j = 0; j < tableData[i].length; j++) {
          const cellText = tableData[i][j];
          const cellX =
            tableX +
            columnWidthFactors
              .slice(0, j)
              .reduce((sum, width) => sum + width, 0);
          const cellY = tableY + i * cellHeight;

          // Draw cell border
          doc
            .rect(cellX - 0.3, cellY, columnWidthFactors[j], cellHeight)
            .lineWidth(1.5)
            .stroke();

          // Draw cell text with word wrap
          // if (j == 0 && i > 0) {
          //   drawCell(
          //     cellText,
          //     cellX + 5,
          //     cellY + 8,
          //     columnWidthFactors[j] - 10,
          //     cellHeight,
          //     "lefy",
          //     "Helvetica-Bold"
          //   );
          // } else
          if (i == 0) {
            drawCell(
              cellText,
              cellX + 5,
              cellY + 8,
              columnWidthFactors[j] - 10,
              cellHeight,
              "center",
              "Helvetica-Bold"
            );
          } else {
            drawCell(
              cellText,
              cellX + 7,
              cellY + 8,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "Helvetica"
            );
          }
        }

        tableYHeight += cellHeight; // Move to the next row
      }
    }

    CreateTable();

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(402).send("Internal Server Error");
  }
};

module.exports = { holidayPdf };
