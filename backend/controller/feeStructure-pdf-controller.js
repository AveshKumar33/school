const { connections } = require("../database/config");
const feeStructureSchema = require("../schema/fee-structure-schema");
const schoolDetailsController = require("./schoolDetailsController");
const standardSchema = require("../schema/standard_schema");
const feeHeadSchema = require("../schema/feeHead-schema");
const PDFDocument = require("pdfkit");
const path = require("path");

const feeStructurePdf = async (req, res) => {
  const feeStructureModel = connections[req.currentSessionYear].model(
    "fee-structure",
    feeStructureSchema
  );

  connections[req.currentSessionYear].model("fee-head", feeHeadSchema);
  connections[req.currentSessionYear].model("standard", standardSchema);

  const schoolData = await schoolDetailsController.schoolDetails(req);

  const doc = new PDFDocument({
    margins: { top: 5, bottom: 5, left: 50, right: 50 },
  });

  try {
    const buffers = [];

    const imagePath = path.join(
      __dirname,
      "../upload",
      "School",
      schoolData?.logo
    );

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.end(pdfData);
    });

    const feeData = await feeStructureModel
      .findOne({ _id: req.params.id })
      .populate("name.name", ["name", "paidMonth"])
      .populate("standard", ["standard"]);

    const myArr = feeData.name.reduce((acc, cur) => {
      const { name, paidMonth } = cur.name;
      return [...acc, [name, cur.amount, paidMonth]];
    }, []);

    doc.rect(19, 20, 573, 125).lineWidth(2).strokeColor("#256a98").stroke();

    doc.image(imagePath, 30, 30, {
      fit: [100, 100],
      align: "center",
      valign: "center",
    });

    doc.image(imagePath, 463, 30, {
      fit: [100, 100],
      align: "center",
      valign: "center",
    });

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#256a98")
      .text(schoolData?.name, 0, 38, {
        align: "center",
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

    doc.fontSize(12).fillColor("#256a98").text(schoolData?.address, 3, 93, {
      align: "center",
      width: doc.page.width,
    });

    doc
      .fontSize(14)
      .fillColor("#256a98")
      .text(
        `Contact No.- ${schoolData.mobileNo}, ${schoolData?.otherMobileNo}`,
        3,
        110,
        {
          align: "center",
          width: doc.page.width,
        }
      );

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#256a98")
      .text(feeData.standard.standard, 3, 160, {
        align: "center",
        width: doc.page.width,
      });

    doc.moveTo(260, 180).lineTo(360, 180).lineWidth(2).fillAndStroke("#256a98");

    const createHeading = (
      rectX = 19,
      rectY = 200,
      width = 573,
      height = 25,
      text = "FEE STRUCTURE"
    ) => {
      doc
        .rect(rectX, rectY, width, height)
        .lineWidth(2)
        .fillColor("#256a98")
        .fill();

      doc
        .fontSize(14)
        .fillColor("#fff")
        .text(text, 0, rectY + 7, {
          align: "center",
          width: doc.page.width,
        });
    };

    createHeading();

    const tableData = [["Name", "Fee", "Duration"]];

    tableData.push(...myArr);

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
      tableY = 225,
      cellMargin = 20,
      fontSize = 8.5
    ) {
      // Define table data
      let tableYHeight = tableY;
      const columnWidths = [25, 10, 65]; // 30%, 40%, 30%
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
          if (j == 0 && i > 0) {
            drawCell(
              cellText,
              cellX + 5,
              cellY + 8,
              columnWidthFactors[j] - 10,
              cellHeight,
              "left",
              "Helvetica-Bold"
            );
          } else if (i == 0) {
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
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { feeStructurePdf };
