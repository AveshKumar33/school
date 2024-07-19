const fs = require("fs");
const { connections } = require("../database/config");
const studentSchema = require("../schema/Student-schema");
const localitySchema = require("../schema/locality-schema");
const stateSchema = require("../schema/state-schema");
const citySchema = require("../schema/city-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const PDFDocument = require("pdfkit");

const generatePdf = async (req, res) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("city-master", citySchema);
    connections[currentSession].model("locality", localitySchema);
    connections[currentSession].model("state", stateSchema);

    const studentData = await student_model
      .findOne({ _id: req.params.id })
      .populate([
        {
          path: "standard",
          select: "standard",
        },
        {
          path: "section",
          select: "section",
        },
        {
          path: "city",
          select: "name",
        },
        {
          path: "locality",
          select: "name",
        },
        {
          path: "state",
          select: "name",
        },
      ]);

    const doc = new PDFDocument({
      margins: { top: 5, bottom: 5, left: 50, right: 50 },
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.end(pdfData);
    });

    const formattedDate = (date) => {
      const dateObject = new Date(date);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      return `${day}/${month}/${year}`;
    };

    doc.rect(19, 20, 573, 125).lineWidth(2).strokeColor("#256a98").stroke();

    //  doc.moveTo(19, 19).lineTo(593, 19).lineWidth(2).fillAndStroke("#256a98"); // horizontal
    // doc.moveTo(20, 20).lineTo(20, 170).lineWidth(2).fillAndStroke("#256a98"); // vertical

    doc.image("./public/image/logo.png", 1, 5, {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });

    // doc.moveTo(20, 169).lineTo(593, 169).lineWidth(2).fillAndStroke("#256a98");
    // doc.moveTo(592, 20).lineTo(592, 170).lineWidth(2).fillAndStroke("#256a98");

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

    const createHeading = (
      rectX = 19,
      rectY = 160,
      width = 573,
      height = 25,
      text = "PERSONAL INFORMATION"
    ) => {
      doc
        .rect(rectX, rectY, width, height)
        .lineWidth(2)
        .fillColor("#256a98")
        .fill();

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#fff")
        .text(text, 0, rectY + 7, {
          align: "center",
          width: doc.page.width,
        });
    };

    createHeading();

    const createRectangle = (
      rectangles,
      startX = 19.5,
      startY = 185,
      textX = 26,
      font = "Helvetica-Bold"
    ) => {
      rectangles.forEach((rectangle) => {
        const { width, height, text } = rectangle;

        doc
          .rect(startX, startY, width, height)
          .lineWidth(1.5)
          .strokeColor("#256a98")
          .stroke();

        const textY = startY + 7;

        // Add text
        doc.fontSize(13).font(font).fillColor("#000").text(text, textX, textY, {
          width: doc.page.width,
        });

        // Increment startY for the next rectangle
        startY += height;
      });
    };

    const rectangleColumns = [
      { width: 155, height: 25, text: "Admission No:" },
      { width: 155, height: 25, text: "Name:" },
      { width: 155, height: 25, text: "Father's Name:" },
      { width: 155, height: 25, text: "Mother's Name:" },
      { width: 155, height: 25, text: "Email:" },
      { width: 155, height: 25, text: "Mobile No:" },
      { width: 155, height: 25, text: "Date of Birth:" },
      { width: 155, height: 25, text: "Cast:" },
      { width: 155, height: 25, text: "Gender:" },
      { width: 155, height: 25, text: "Identification Marks:" },
    ];

    createRectangle(rectangleColumns);

    const rectWithText = (startX, startY, width, height, font, text) => {
      doc
        .rect(startX, startY, width, height, font)
        .lineWidth(1.5)
        .strokeColor("#256a98")
        .stroke();

      const textX = startX + 7;
      const textY = startY + 8;

      doc.fontSize(12).fillColor("#000").font(font).text(text, textX, textY, {
        width: doc.page.width,
      });
    };

    rectWithText(175, 185, 136, 25, "Helvetica", studentData?.admissionNo);
    rectWithText(311, 185, 142.5, 25, "Helvetica-Bold", "Admission Date:");
    rectWithText(
      453.5,
      185,
      138,
      25,
      "Helvetica",
      formattedDate(studentData?.admissionDate)
    );

    const rectanglesCell = [
      {
        width: 278.5,
        height: 25,
        text:
          studentData?.salutation +
          " " +
          studentData?.firstName +
          " " +
          studentData?.middleName +
          " " +
          studentData?.lastName,
      },
      { width: 278.5, height: 25, text: studentData?.fatherName },
      { width: 278.5, height: 25, text: studentData?.motherName },
      { width: 278.5, height: 25, text: studentData?.email },
      { width: 278.5, height: 25, text: studentData?.mobileNo },
      {
        width: 278.5,
        height: 25,
        text: formattedDate(studentData?.dateOfBirth),
      },
      { width: 278.5, height: 25, text: studentData?.cast },
      { width: 80, height: 25, text: studentData?.gender },
      { width: 170, height: 25, text: studentData?.identificationMarks },
    ];

    createRectangle(rectanglesCell, 175, 210, 181, "Helvetica");

    doc
      .rect(453.5, 210, 138, 175)
      .lineWidth(1.5)
      .strokeColor("#256a98")
      .stroke();

    // doc.image("./upload/Student/photo/" + studentData?.photo, 462, 172, {
    //   fit: [120, 250],
    //   align: "center",
    //   valign: "center",
    // });

    const imagePath = `./upload/Student/photo/${studentData?.photo}`;
    const defaultImagePath = "./upload/Student/photo/student.png";

    // Check if the image file exists
    try {
      if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
        doc.image(imagePath, 462, 172, {
          fit: [120, 250],
          align: "center",
          valign: "center",
        });
      } else {
        doc.image(defaultImagePath, 462, 172, {
          fit: [120, 250],
          align: "center",
          valign: "center",
        });
      }
    } catch (err) {
      console.error("Error occurred while processing the image:", err);
      doc.image(defaultImagePath, 462, 172, {
        fit: [120, 250],
        align: "center",
        valign: "center",
      });
    }

    rectWithText(255, 385, 90, 25, "Helvetica-Bold", "Religion:");
    rectWithText(345, 385, 85, 25, "Helvetica", studentData?.religion);
    rectWithText(430, 385, 100, 25, "Helvetica-Bold", "Blood Group:");
    rectWithText(530, 385, 61.5, 25, "Helvetica", studentData?.bloodGroup);

    rectWithText(345, 410, 108, 25, "Helvetica-Bold", "Nationlity: ");
    rectWithText(453.5, 410, 138, 25, "Helvetica", studentData?.nationality);

    createHeading(19, 445, 573, 25, "ADDRESS");

    const adressColumns = [
      { width: 190, height: 25, text: "Correspondence Address:" },
      { width: 190, height: 25, text: "Permanent Address:" },
      { width: 190, height: 25, text: "Locality:" },
      { width: 190, height: 25, text: "District:" },
    ];

    createRectangle(adressColumns, 19.5, 470, 26, "Helvetica-Bold");

    const adressCells = [
      {
        width: 383,
        height: 25,
        text: studentData?.correspondenceAdd,
      },
      {
        width: 383,
        height: 25,
        text: studentData?.permanentAdd,
      },
      { width: 110, height: 25, text: studentData?.locality?.name },
      { width: 110, height: 25, text: studentData?.district },
    ];

    createRectangle(adressCells, 209, 470, 215, "Helvetica");

    rectWithText(319, 520, 100, 25, "Helvetica-Bold", "City: ");
    rectWithText(419, 520, 173, 25, "Helvetica", studentData?.city?.name);

    rectWithText(319, 545, 100, 25, "Helvetica-Bold", "Pin Code: ");
    rectWithText(419, 545, 173, 25, "Helvetica", studentData?.pinCode);

    createHeading(19, 580, 573, 25, "PREVIOUS ACADEMIC DETAILS");

    const prevAcadCell1 = [
      { width: 100, height: 25, text: "School Name:" },
      { width: 100, height: 25, text: "Standard:" },
      { width: 100, height: 25, text: "Marks:" },
    ];

    createRectangle(prevAcadCell1, 19.5, 605, 26, "Helvetica-Bold");

    const prevAcadRows1 = [
      { width: 472, height: 25, text: studentData?.schoolName },
      { width: 200, height: 25, text: studentData?.previousStandard },
      { width: 200, height: 25, text: studentData?.obtainedMarks },
    ];

    createRectangle(prevAcadRows1, 119.5, 605, 126, "Helvetica");

    const prevAcadCell2 = [
      { width: 150, height: 25, text: "Passing Year:" },
      { width: 150, height: 25, text: "Percentage/CGPA:" },
    ];

    createRectangle(prevAcadCell2, 319.5, 630, 326, "Helvetica-Bold");

    const prevAcadRow2 = [
      { width: 122, height: 25, text: formattedDate(studentData?.passingYear) },
      { width: 122, height: 25, text: studentData?.percentageCGPA },
    ];

    createRectangle(prevAcadRow2, 469.5, 630, 476, "Helvetica");

    createHeading(19, 690, 573, 25, "CURRENT ACADEMIC DETAILS");

    rectWithText(19.5, 715, 100, 25, "Helvetica-Bold", "Standard: ");
    rectWithText(
      119.5,
      715,
      200,
      25,
      "Helvetica",
      studentData?.standard.standard
    );
    rectWithText(319.5, 715, 150, 25, "Helvetica-Bold", "Section:");
    rectWithText(469.5, 715, 122, 25, "Helvetica", studentData.section.section);

    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { generatePdf };
