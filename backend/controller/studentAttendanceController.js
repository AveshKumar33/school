const { connections } = require("../database/config");
const attendanceSchema = require("../schema/student-attendance-schema");
const mongoose = require("mongoose");
const studentSchema = require("../schema/Student-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const sessionSchema = require("../schema/session-year-schema");

exports.updateAttendance = async (req, res, next) => {
  try {
    const stuAttendance_model = connections[req.currentSessionYear].model(
      "student-attendance",
      attendanceSchema
    );

    const { student, status, leaveType, remark } = req.body;

    if (!student) {
      return res.status(400).json({
        message: "Employee ID is required!",
        status: "Bad Request",
      });
    }

    const ISTDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const date = new Date(ISTDate);
    const currDate = date.toISOString().split("T")[0];

    const existingRecord = await stuAttendance_model.findOne({
      date: currDate,
      "attendance.student": student,
    });

    if (existingRecord) {
      const attendance = existingRecord.attendance;
      const existingEntryIndex = attendance.findIndex(
        (entry) => entry.student.toString() === student
      );

      if (existingEntryIndex !== -1) {
        if (status !== undefined) {
          attendance[existingEntryIndex].status = status;
        }
        if (leaveType !== undefined) {
          attendance[existingEntryIndex].leaveType = leaveType;
        }
        if (remark !== undefined) {
          attendance[existingEntryIndex].remark = remark;
        }
      } else {
        attendance.push({ employee, status, leaveType, remark });
      }

      await existingRecord.save();

      return res.status(200).json({
        message: "Attendance marked successfully!",
      });
    } else {
      const error = new Error("No document created for attendance!");
      error.statusCode = 204;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res) => {
  const data = JSON.parse(req.query.flterData);
  const { standard, section } = data;

  const ISTDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  const date = new Date(ISTDate);
  const currDate = date.toISOString().split("T")[0];

  const query = { date: currDate };

  if (standard) {
    query.standard = standard;
  }

  if (section) {
    query.section = section;
  }

  try {
    const stuAttendance_model = connections[req.currentSessionYear].model(
      "student-attendance",
      attendanceSchema
    );

    connections[req.currentSessionYear].model("student", studentSchema);

    const attendanceData = await stuAttendance_model.find(query).populate({
      path: "attendance.student",
      model: "student",
      select: "salutation firstName middleName lastName mobileNo",
    });

    res.status(200).json({ data: attendanceData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.getAllAttendance = async (req, res, next) => {
  try {
    let page = +req.query.page + 1 || 1;
    const ITEMS_PER_PAGE = +req.query.perPage || 20;
    const searchData = JSON.parse(req.query?.search);

    const stuAttendance_model = connections[req.currentSessionYear].model(
      "student-attendance",
      attendanceSchema
    );

    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("session", sessionSchema);

    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const { session, section, standard, searchText, status, from, to } =
      searchData;

    const query = {};

    const currSession = session || req.currentSession;

    if (currSession) {
      query.session = new mongoose.Types.ObjectId(currSession);
    }

    if (standard) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    if (section.length > 0) {
      const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
      query.section = { $in: sectionIds };
    }

    let matchCondition = {};
    const matchConditions = [];

    if (from && to) {
      const dateCondition = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
      matchConditions.push({ date: dateCondition });
    } else if (from) {
      const dateCondition = {
        $gte: new Date(from),
      };
      matchConditions.push({ date: dateCondition });
    }

    if (status) {
      matchConditions.push({ "attendance.status": status });
    }

    if (searchText) {
      const searchValue = searchText;
      const numericValue = Number(searchValue);

      if (!isNaN(numericValue)) {
        matchConditions.push({ "student.rollNo": numericValue });
      } else {
        matchConditions.push({
          $or: [
            { "student.firstName": { $regex: searchValue, $options: "i" } },
            { "student.middleName": { $regex: searchValue, $options: "i" } },
            { "student.lastName": { $regex: searchValue, $options: "i" } },
          ],
        });
      }
    }

    if (matchConditions.length > 0) {
      matchCondition.$and = matchConditions;
    }

    const aggregateQuery = [
      {
        $match: query,
      },
      {
        $unwind: "$attendance",
      },
      {
        $lookup: {
          from: student_model.collection.name,
          localField: "attendance.student",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $match: matchCondition,
      },
      {
        $sort: {
          "student.standard": 1,
        },
      },
    ];

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE }
    );

    const studentAttendanceData = await stuAttendance_model.aggregate(
      aggregateQuery
    );

    const countAggData = [
      {
        $match: query,
      },
      {
        $unwind: "$attendance",
      },
      {
        $lookup: {
          from: student_model.collection.name,
          localField: "attendance.student",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $match: matchCondition,
      },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ];

    const totalData = await stuAttendance_model.aggregate(countAggData);

    const data = await stuAttendance_model.populate(studentAttendanceData, [
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
        path: "attendance.student",
        model: "student",
        select: "salutation firstName middleName lastName mobileNo rollNo",
      },
    ]);

    res
      .status(200)
      .json({ data: data, status: "Success", totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};
