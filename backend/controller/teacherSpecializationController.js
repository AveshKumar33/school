const { connections } = require("../database/config");
const teacherSpecializationSchema = require("../schema/teacher-specialization-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const employeeSchema = require("../schema/employee-schema");
const paperSchema = require("../schema/paper-schema");
const sessionSchema = require("../schema/session-year-schema");
const mongoose = require("mongoose");

exports.postData = async (req, res, next) => {
  try {
    const teacherSpecializationModel = connections[
      req.currentSessionYear
    ].model("teacher-specialization", teacherSpecializationSchema);

    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);

    const bodyData = req.body;
    const existingTeachersData = [];

    for (const data of bodyData) {
      const { session, standard, section, teacher } = data;
      const existingData = await teacherSpecializationModel
        .findOne({
          session: session,
          standard: standard,
          section: section,
          teacher: teacher,
        })
        .populate([
          {
            path: "standard",
            select: "standard",
          },
          {
            path: "section",
            select: "section",
          },
          { path: "teacher", select: "firstName lastName middleName" },
        ]);

      if (existingData) {
        existingTeachersData.push(existingData);
      } else {
        const newTeacher = new teacherSpecializationModel(data);
        await newTeacher.save();
      }
    }

    res.status(201).send({
      data: existingTeachersData,
      status: "Success",
      message:
        existingTeachersData.length > 0
          ? "Other Teacher details saved!"
          : "Detailed Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 20;
  const searchData = JSON.parse(req.query?.search);

  const { session, section, standard, teacher, paper } = searchData;

  const currSession = session || req?.currentSession;

  const query = {};

  if (currSession) {
    query.session = new mongoose.Types.ObjectId(currSession);
  }

  if (standard) {
    query.standard = new mongoose.Types.ObjectId(standard);
  }

  if (teacher) {
    query.teacher = new mongoose.Types.ObjectId(teacher);
  }

  if (section.length > 0) {
    const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
    query.section = { $in: sectionIds };
  }

  if (paper.length > 0) {
    const paperIds = paper.map((id) => new mongoose.Types.ObjectId(id));
    query.paper = { $in: paperIds };
  }

  try {
    const teacherSpecializationModel = connections[
      req.currentSessionYear
    ].model("teacher-specialization", teacherSpecializationSchema);

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("paper", paperSchema);

    const aggregateQuery = [];
    const countAggData = [];

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
      {
        $sort: {
          standard: 1,
        },
      }
    );

    if (Object.keys(query).length !== 0) {
      aggregateQuery.push({ $match: query });
      countAggData.push({ $match: query });
    }

    countAggData.push({
      $group: {
        _id: 1,
        count: { $sum: 1 },
      },
    });

    const totalData = await teacherSpecializationModel.aggregate(countAggData);

    const aggData = await teacherSpecializationModel.aggregate(aggregateQuery);

    const data = await teacherSpecializationModel.populate(aggData, [
      { path: "session" },
      {
        path: "standard",
        select: "standard",
      },
      {
        path: "section",
        select: "section",
      },
      {
        path: "paper",
        select: "paper",
      },
      {
        path: "teacher",
        select: "salutation firstName middleName lastName",
      },
    ]);

    res.status(200).json({
      data: data,
      totalData: totalData[0]?.count,
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const teacherSpecializationModel = connections[
      req.currentSessionYear
    ].model("teacher-specialization", teacherSpecializationSchema);

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("paper", paperSchema);

    const aggData = await teacherSpecializationModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    ]);

    const data = await teacherSpecializationModel.populate(aggData, [
      { path: "session" },
      {
        path: "standard",
        populate: {
          path: "sections",
        },
      },
      {
        path: "section",
        select: "section",
      },
      {
        path: "paper",
        select: "paper",
      },
      {
        path: "teacher",
        select: "salutation firstName middleName lastName",
      },
    ]);

    res.status(200).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const teacherSpecializationModel = connections[
      req.currentSessionYear
    ].model("teacher-specialization", teacherSpecializationSchema);

    const allData = await teacherSpecializationModel.find().sort("type");

    res.status(200).json({ data: allData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const teacherSpecializationModel = connections[
      req.currentSessionYear
    ].model("teacher-specialization", teacherSpecializationSchema);

    const updatedData = await teacherSpecializationModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name[0] },
      { new: true }
    );

    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Successfully Updated!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const teacherSpecializationModel = connections[
      req.currentSessionYear
    ].model("teacher-specialization", teacherSpecializationSchema);

    const removedDate = await teacherSpecializationModel.findByIdAndRemove(
      req.params.id
    );

    res.status(200).json({
      data: removedDate,
      status: "Success",
      message: "Successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
