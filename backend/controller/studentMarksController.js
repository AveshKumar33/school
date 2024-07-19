const { connections } = require("../database/config");
const marksSchema = require("../schema/student-marks-schema");
const studentSchema = require("../schema/Student-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const examTypeSchema = require("../schema/exam-type-schema");
const addExamSchema = require("../schema/add-exam-schema");
const paperSchema = require("../schema/paper-schema");
// const mongoose = require("mongoose");
// const student_model = require("../schema/Student-schema");

exports.postMarks = async (req, res, next) => {
  try {
    const stuMarksModel = connections[req.currentSessionYear].model(
      "student-marks",
      marksSchema
    );

    const { session, student, standard, section, examType, examName, marks } =
      req.body;

    const existingRecord = await stuMarksModel.findOne({
      session,
      student,
      standard,
      section,
      examType,
      examName,
    });

    if (existingRecord) {
      existingRecord.marks = marks;
      const updatedRecord = await existingRecord.save();

      return res.status(200).send({
        data: updatedRecord,
        status: "Success",
        message: "Marks Updated!",
      });
    } else {
      const newStudent = new stuMarksModel(req.body);
      const stuData = await newStudent.save();

      return res.status(201).send({
        data: stuData,
        status: "Success",
        message: "Marks Saved!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllMarks = async (req, res, next) => {
  try {
    const stuMarksModel = connections[req.currentSessionYear].model(
      "student-marks",
      marksSchema
    );

    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("exam", addExamSchema);
    connections[req.currentSessionYear].model("exam-type", examTypeSchema);
    connections[req.currentSessionYear].model("paper", paperSchema);
    connections[req.currentSessionYear].model("student", studentSchema);

    const data = JSON.parse(req.query.search);
    const { session, standard, section, student, examName, examType } = data;

    const query = {};

    const currSession = session || req.currentSession;

    if (currSession) {
      query.session = currSession;
    }

    if (student) {
      query.student = student;
    }

    if (examType) {
      query.examType = examType;
    }

    if (examName) {
      query.examName = examName;
    }

    if (standard) {
      query.standard = standard;
    }

    if (section) {
      query.section = section;
    }
    const marksData = await stuMarksModel.find(query).populate([
      {
        path: "student",
        select:
          "salutation, firstName middleName lastName fatherName standard section rollNo registrationNo",
        populate: [
          { path: "standard", select: "standard" },
          {
            path: "section",
          },
        ],
      },
      { path: "standard" },
      { path: "section" },
      { path: "examType" },
      { path: "examName" },
      { path: "marks.paperId", select: "paper" },
    ]);

    res.status(200).json({ data: marksData });
  } catch (error) {
    next(error);
  }
};

// exports.getAllAttendance = async (req, res, next) => {
//   try {
//     let page = +req.query.page + 1 || 1;
//     const ITEMS_PER_PAGE = +req.query.perPage || 20;
//     const searchData = JSON.parse(req.query?.search);

//     const { session, section, standard, searchText, status, from, to } =
//       searchData;

//     const query = {};

//     const currSession = session || req.currentSession;

//     if (currSession) {
//       query.session = new mongoose.Types.ObjectId(currSession);
//     }

//     if (standard) {
//       query.standard = new mongoose.Types.ObjectId(standard);
//     }

//     if (section.length > 0) {
//       const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
//       query.section = { $in: sectionIds };
//     }

//     let matchCondition = {};
//     const matchConditions = [];

//     if (from && to) {
//       const dateCondition = {
//         $gte: new Date(from),
//         $lte: new Date(to),
//       };
//       matchConditions.push({ date: dateCondition });
//     } else if (from) {
//       const dateCondition = {
//         $gte: new Date(from),
//       };
//       matchConditions.push({ date: dateCondition });
//     }

//     if (status) {
//       matchConditions.push({ "attendance.status": status });
//     }

//     if (searchText) {
//       const searchValue = searchText;
//       const numericValue = Number(searchValue);

//       if (!isNaN(numericValue)) {
//         matchConditions.push({ "student.rollNo": numericValue });
//       } else {
//         matchConditions.push({
//           $or: [
//             { "student.firstName": { $regex: searchValue, $options: "i" } },
//             { "student.middleName": { $regex: searchValue, $options: "i" } },
//             { "student.lastName": { $regex: searchValue, $options: "i" } },
//           ],
//         });
//       }
//     }

//     if (matchConditions.length > 0) {
//       matchCondition.$and = matchConditions;
//     }

//     const aggregateQuery = [
//       {
//         $match: query,
//       },
//       {
//         $unwind: "$attendance",
//       },
//       {
//         $lookup: {
//           from: student_model.collection.name,
//           localField: "attendance.student",
//           foreignField: "_id",
//           as: "student",
//         },
//       },
//       {
//         $match: matchCondition,
//       },
//       {
//         $sort: {
//           "student.standard": 1,
//         },
//       },
//     ];

//     aggregateQuery.push(
//       { $skip: (page - 1) * ITEMS_PER_PAGE },
//       { $limit: ITEMS_PER_PAGE }
//     );

//     const studentAttendanceData = await stuMarksModel.aggregate(aggregateQuery);

//     const countAggData = [
//       {
//         $match: query,
//       },
//       {
//         $unwind: "$attendance",
//       },
//       {
//         $lookup: {
//           from: student_model.collection.name,
//           localField: "attendance.student",
//           foreignField: "_id",
//           as: "student",
//         },
//       },
//       {
//         $match: matchCondition,
//       },
//       {
//         $group: {
//           _id: 1,
//           count: { $sum: 1 },
//         },
//       },
//     ];

//     const totalData = await stuMarksModel.aggregate(countAggData);

//     const data = await stuMarksModel.populate(studentAttendanceData, [
//       { path: "session" },
//       {
//         path: "standard",
//         select: "standard",
//       },
//       {
//         path: "section",
//         select: "section",
//       },
//       {
//         path: "attendance.student",
//         model: "student",
//         select: "salutation firstName middleName lastName mobileNo rollNo",
//       },
//     ]);

//     res
//       .status(200)
//       .json({ data: data, status: "Success", totalData: totalData[0]?.count });
//   } catch (error) {
//     next(error);
//   }
// };
