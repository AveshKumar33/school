const { connections } = require("../database/config");
const examScheduleSchema = require("../schema/exam-schedule-schema");
const employeeSchema = require("../schema/employee-schema");
const sessionSchema = require("../schema/session-year-schema");
const sectionSchema = require("../schema/section-schema");
const standardSchema = require("../schema/standard_schema");
const addExamSchema = require("../schema/add-exam-schema");
const paperMapSchema = require("../schema/paperMap-schema");
const paperSchema = require("../schema/paper-schema");
const examTypeSchema = require("../schema/exam-type-schema");
const mongoose = require("mongoose");

exports.postData = async (req, res, next) => {
  try {
    const examScheduleModel = connections[req.currentSessionYear].model(
      "exam-schedule",
      examScheduleSchema
    );

    const newSchedules = await examScheduleModel.insertMany(req.body);

    res.status(201).send({
      data: newSchedules,
      status: "Success",
      message: "Data Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 10;

  const searchData = JSON.parse(req.query?.search);

  const { session, section, standard, examName } = searchData;

  const query = {};

  const curSession = session || req?.currentSession;

  if (curSession) {
    query.session = new mongoose.Types.ObjectId(curSession);
  }

  if (standard) {
    query.standard = new mongoose.Types.ObjectId(standard);
  }

  if (section.length > 0) {
    const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
    query.section = { $in: sectionIds };
  }

  if (examName) {
    query["paper.examName.examName"] = new mongoose.Types.ObjectId(examName);
  }

  try {
    const examScheduleModel = connections[req.currentSessionYear].model(
      "exam-schedule",
      examScheduleSchema
    );

    const sessionModel = connections[req.currentSessionYear].model(
      "session",
      sessionSchema
    );
    const employeeModel = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );
    const standardModel = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    const sectionModel = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    const paperModel = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );
    const examModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );

    const aggregateQuery = [];
    const countAggData = [];

    if (Object.keys(query).length !== 0) {
      aggregateQuery.push({ $match: query });
      countAggData.push({ $match: query });
    }

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
      {
        $sort: {
          standard: 1,
        },
      }
    );

    countAggData.push({
      $group: {
        _id: 1,
        count: { $sum: 1 },
      },
    });

    const totalData = await examScheduleModel.aggregate(countAggData);

    const result = await examScheduleModel.aggregate(aggregateQuery);

    const data = await examScheduleModel.populate(result, [
      { path: "session", select: "_id name" },
      { path: "standard" },
      { path: "section" },
      { path: "teacher", select: "firstName middleName lastName mobileNo" },
      {
        path: "paper",
        select: "examType maxMarks minMarks paper weightage",
        populate: [
          { path: "examType" },
          {
            path: "paper",
            select: "paper",
          },
          { path: "examName" },
        ],
      },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

exports.getAlldata = async (req, res, next) => {
  try {
    const examScheduleModel = connections[req.currentSessionYear].model(
      "exam-schedule",
      examScheduleSchema
    );

    const examScheduleData = await examScheduleModel.aggregate([
      {
        $sort: {
          scheduleDate: 1,
          //   section: 1,
        },
      },
    ]);

    const sessionModel = connections[req.currentSessionYear].model(
      "session",
      sessionSchema
    );
    const employeeModel = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );
    const standardModel = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    const sectionModel = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    const paperModel = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );
    const examModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const data = await examScheduleModel.populate(examScheduleData, [
      [
        { path: "session" },
        { path: "standard" },
        { path: "section" },
        { path: "teacher", select: "firstName middleName lastName mobileNo" },
        { path: "paper" },
        { path: "examName" },
      ],
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const examScheduleModel = connections[req.currentSessionYear].model(
      "exam-schedule",
      examScheduleSchema
    );

    const sessionModel = connections[req.currentSessionYear].model(
      "session",
      sessionSchema
    );
    const employeeModel = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );
    const standardModel = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    const sectionModel = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );
    const paperModel = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );
    const examModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const id = req.params.id;

    const aggregateQuery = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
    ];

    const result = await examScheduleModel.aggregate(aggregateQuery);

    const data = await examScheduleModel.populate(result, [
      { path: "session" },
      {
        path: "standard",
        populate: {
          path: "sections",
        },
      },
      { path: "section" },
      { path: "teacher", select: "firstName middleName lastName mobileNo" },
      {
        path: "paper",
        populate: [
          { path: "paper" },
          { path: "examType" },
          { path: "examName" },
        ],
      },
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const examScheduleModel = connections[req.currentSessionYear].model(
      "exam-schedule",
      examScheduleSchema
    );

    const updatedExamType = await examScheduleModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedExamType,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const examScheduleModel = connections[req.currentSessionYear].model(
      "exam-schedule",
      examScheduleSchema
    );

    const removedData = await examScheduleModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
