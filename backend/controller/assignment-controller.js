const path = require("path");
const fs = require("fs");
const { connections } = require("../database/config");
const assignmentSchema = require("../schema/assignment-schema");

exports.postAssignment = async (req, res, next) => {
  try {
    const assignment_model = connections[req.currentSessionYear].model(
      "assignment",
      assignmentSchema
    );

    const data = JSON.parse(req.body.data);

    const teacherId = data.teacherId;
    const standardId = data.standardId;
    const sectionId = data.sectionId;
    const filename = req.files["assignment"][0].filename;

    await assignment_model.addOrUpdateAssignment(teacherId, {
      name: filename,
      standardId,
      sectionId,
    });

    res.status(201).send({
      status: "Success",
      message: "Assignment Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssignment = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  // const search = req.query.search || "";
  const ITEMS_PER_PAGE = req.query.perPage;
  const sortField = req.query.sortField || "firstName";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  // const query = {
  //   $or: [
  //     { firstName: { $regex: search, $options: "i" } },
  //     { middleName: { $regex: search, $options: "i" } },
  //     { lastName: { $regex: search, $options: "i" } },
  //   ],
  // };

  try {
    const assignment_model = connections[req.currentSessionYear].model(
      "assignment",
      assignmentSchema
    );

    const numbersOfData = await assignment_model.find().count();

    const studentData = await assignment_model
      .find()
      .populate([
        {
          path: "assignment.standardId",
          select: "standard",
        },
        {
          path: "assignment.sectionId",
          select: "section",
        },
      ])
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    //   console.log(standardData);

    res.status(200).json({ data: studentData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment_model = connections[req.currentSessionYear].model(
      "assignment",
      assignmentSchema
    );

    const studentData = await assignment_model
      .findOne({
        teacherId: req.params.id,
      })
      .populate([
        {
          path: "assignment.standardId",
          select: "standard",
        },
        {
          path: "assignment.sectionId",
          select: "section",
        },
      ]);
    res.status(200).json({ data: studentData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.deletAssignemet = async (req, res, next) => {
  try {
    const assignment_model = connections[req.currentSessionYear].model(
      "assignment",
      assignmentSchema
    );

    const teacherId = req.body.teacherId;
    const assignmentId = req.body.assignmentId;

    await assignment_model.removeAssignment(teacherId, assignmentId);

    res.status(201).send({
      status: "Success",
      message: "Assignment Successfully removed!",
    });
  } catch (error) {
    next(error);
  }
};

exports.viewAssignment = async (req, res, next) => {
  try {
    const filePath = path.join(
      __dirname,
      "../upload/Teacher/assignment",
      req.params.filename
    );

    if (fs.existsSync(filePath)) {
      const extname = path.extname(filePath).toLowerCase();

      let contentType = "";

      if (extname === ".pdf") {
        contentType = "application/pdf";
      } else if (extname === ".jpg" || extname === ".jpeg") {
        contentType = "image/jpeg";
      } else if (extname === ".png") {
        contentType = "image/png";
      } else if (extname === ".doc" || extname === ".docx") {
        contentType = "application/msword";
      } else if (extname === ".xls" || extname === ".xlsx") {
        contentType = "application/vnd.ms-excel";
      }

      res.setHeader("Content-Type", contentType);
      const fileStream = fs.createReadStream(filePath);

      fileStream.pipe(res);
    } else {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
