const { connections } = require("../database/config");
const feeRecordSchema = require("../schema/feeRecord-schema");
const feeHeadSchema = require("../schema/feeHead-schema");
const sessionSchema = require("../schema/session-year-schema");
const adminSchema = require("../schema/admin-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const studentSchema = require("../schema/Student-schema");
const receiptCounterSchema = require("../schema/receiptNoCounter");
const castCategorySchema = require("../schema/cast-category-schema");
const mongoose = require("mongoose");

const months = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const monthOrder = {
  April: 1,
  May: 2,
  June: 3,
  July: 4,
  August: 5,
  September: 6,
  October: 7,
  November: 8,
  December: 9,
  January: 10,
  February: 11,
  March: 12,
};

exports.postData = async (req, res, next) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const savedData = await feeRecordModel.insertMany(req.body);

    res.status(201).send({
      data: savedData,
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};

// student fee increment
exports.studentFeeIncrement = async (req, res, next) => {
  try {
    const { session = "", student } = req?.headers;
    const feeData = req.body;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const updatedRecords = [];
    const newRecords = [];

    for (let feeRecord of feeData) {
      if (feeRecord.hasOwnProperty("_id")) {
        const existingFeeRecord = await feeRecordModel.findById(feeRecord._id);

        if (existingFeeRecord) {
          if (feeRecord.incrementedAmount > 0) {
            existingFeeRecord.remainingAmount += feeRecord.incrementedAmount;
            existingFeeRecord.incrementedAmount += feeRecord.incrementedAmount;

            const allPaid =
              Number(existingFeeRecord.remainingAmount) +
              Number(feeRecord?.incrementedAmount);

            existingFeeRecord.isAllPaid = allPaid === 0;
            existingFeeRecord.remainingAmount =
              allPaid === 0 ? 0 : existingFeeRecord.remainingAmount;

            // if (AllPaid === 0) {
            //   existingFeeRecord.isAllPaid = true;
            //   existingFeeRecord.remainingAmount = 0;
            // } else {
            //   existingFeeRecord.isAllPaid = false;
            // }

            await existingFeeRecord.save();
          }
          updatedRecords.push(existingFeeRecord);
        }
      } else {
        newRecords.push(feeRecord);
      }
    }

    if (newRecords.length > 0) {
      await feeRecordModel.insertMany(newRecords);
    }

    res.status(201).send({
      data: "updatedRecords",
      status: "Success",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// on student standard and section edit
exports.deleteAndCreateData = async (req, res, next) => {
  try {
    const { session = "", student } = req?.headers;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const existingRecord = await feeRecordModel.find({ student: student });

    if (existingRecord.length > 0) {
      await feeRecordModel.deleteMany({ student: student });
    }

    const savedData = await feeRecordModel.insertMany(req.body);

    res.status(201).send({
      data: savedData,
      status: "Success",
    });
  } catch (err) {
    await feeRecordModel.insertMany(existingRecord);
    next(err);
  }
};

// exports.postData = async (req, res, next) => {
//   try {
//     const newData = new feeRecordModel(req.body);

//     const savedData = await newData.save();

//     res.status(201).send({
//       data: savedData,
//       status: "Success",
//       message: "Details Saved!",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 10;

  try {
    const feeRecordModel = connections[req.currentSessionYear].model(
      "fee-records",
      feeRecordSchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const totalData = await feeRecordModel.aggregate([
      { $sort: { $feeHead: 1 } },
    ]);

    const feeRecordData = await feeRecordModel.aggregate([
      // { $unwind: "$feeHead" },
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
    ]);

    const data = await feeRecordModel.populate(feeRecordData, [
      { path: "session" },
      { path: "feeHead", select: "name" },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session = "", student, months = [], isAllPaid } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    connections[currentSession].model("fee-head", feeHeadSchema);

    const query = {};

    // if (student) {
    //   query.student = new mongoose.Types.ObjectId(student);
    // }

    if (student && Array.isArray(student) && student.length > 0) {
      const studentId = student.map(
        (stud) => new mongoose.Types.ObjectId(stud)
      );
      query.student = { $in: studentId };
    } else if (student && !Array.isArray(student)) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    if (months?.length > 0) {
      query.month = { $in: months };
      query.isAllPaid = isAllPaid;
    }

    // const data = await feeRecordModel.find();
    const data = await feeRecordModel.aggregate([
      {
        $match: query,
      },
    ]);

    const feeRecord = await feeRecordModel.populate(data, [
      { path: "feeHead", select: "name" },
    ]);

    res.status(200).json({ data: feeRecord, status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getAllStudentFeeGroupedData = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session = "", student, months = [], isAllPaid } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    connections[currentSession].model("fee-head", feeHeadSchema);

    const query = {};

    // if (student) {
    //   query.student = new mongoose.Types.ObjectId(student);
    // }

    if (student && Array.isArray(student) && student.length > 0) {
      const studentId = student.map(
        (stud) => new mongoose.Types.ObjectId(stud)
      );
      query.student = { $in: studentId };
    } else if (student && !Array.isArray(student)) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    if (months?.length > 0) {
      query.month = { $in: months };
      query.isAllPaid = isAllPaid;
    }

    // const data = await feeRecordModel.find();
    const data = await feeRecordModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            student: "$student",
          },
          feeRecord: { $push: "$$ROOT" },
        },
      },
    ]);

    const feeRecord = await feeRecordModel.populate(data, [
      { path: "feeHead", select: "name" },
    ]);

    res.status(200).json({ data: feeRecord, status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getAllFeeDataGroupedByFeeHEad = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session = "", student = "", months = [], isAllPaid } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    connections[currentSession].model("fee-head", feeHeadSchema);

    const query = {};

    if (student) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    if (months?.length > 0) {
      query.month = { $in: months };
      query.isAllPaid = isAllPaid;
    }

    const feeRecord = await feeRecordModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            student: "$student",
            feeHead: "$feeHead",
          },
          records: { $push: "$$ROOT" },
        },
      },
    ]);

    res.status(200).json({ data: feeRecord, status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getStudentsMonthPaid = async (req, res, next) => {
  const searchData = JSON.parse(req?.query?.search);

  const { session = "", student = "", months = [] } = searchData;

  const query = {};

  const currentSession = session || req.currentSessionYear;

  if (student) {
    query.student = new mongoose.Types.ObjectId(student);
  }

  try {
    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const data = await feeRecordModel.aggregate([
      {
        $match: query,
      },
      {
        $sort: { month: 1 },
      },
      {
        $project: {
          _id: 0,
          month: 1,
          isAllPaid: 1,
          isPreviousBalance: 1,
        },
      },
    ]);

    res.status(200).json({ data: data, status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.getLogData = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);
    const {
      session = "",
      student = "",
      months,
      isBankPaid,
      receiptNo = "",
    } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[currentSession].model("fee-head", feeHeadSchema);
    connections[currentSession].model("admin", adminSchema);

    const query = {};

    if (student) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    if (months?.length > 0) {
      query.month = { $in: months };
      query.isAllPaid = Boolean(isAllPaid);
    }

    const aggQuery = [
      {
        $match: query,
      },
      {
        $unwind: "$log",
      },
      {
        $match: { "log.isBankPaid": isBankPaid },
      },
      {
        $sort: { "log.receiptNo": 1 },
      },
    ];

    if (receiptNo) {
      aggQuery.push({
        $match: { "log.receiptNo": Number(receiptNo) },
      });
    }

    const data = await feeRecordModel.aggregate(aggQuery);

    const feeRecord = await feeRecordModel.populate(data, [
      { path: "session", select: "name" },
      { path: "feeHead", select: "name" },
      { path: "log.createdBy" },
      { path: "log.cancelBy" },
      { path: "log.revokedBy" },
      { path: "log.approvedBy" },
    ]);

    res.status(200).json({ data: feeRecord, status: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// for bank mode payments
exports.getLogsData = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);
    const { session = "", student = "", isBankPaid } = searchData;

    const query = {};

    if (student) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const sessionModel = connections[req.currentSessionYear].model(
      "session",
      sessionSchema
    );
    const feeHeadModel = connections[currentSession].model(
      "fee-head",
      feeHeadSchema
    );
    connections[currentSession].model("admin", adminSchema);

    const aggQuery = [
      {
        $match: query,
      },
      {
        $unwind: "$log",
      },
      {
        $match: { "log.isBankPaid": isBankPaid },
      },
      {
        $sort: { "log.receiptNo": 1 },
      },
      {
        $group: {
          _id: {
            receiptNo: "$log.receiptNo",
          },
          date: { $first: "$log.date" },
          isCancel: { $first: "$log.isCancel" },
          isApproved: { $first: "$log.isApproved" },
          session: { $first: "$session" },
          student: { $first: "$student" },
          standard: { $first: "$standard" },
          section: { $first: "$section" },
          incrementedAmount: { $first: "$incrementedAmount" },
          isBankPaid: { $first: "$log.isBankPaid" },
          voucherGeneratedDate: { $first: "$log.voucherGeneratedDate" },
          months: { $addToSet: "$month" },
          totalPayableAmount: { $sum: "$log.payableAmount" },
          logs: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 1,
          session: 1,
          standard: 1,
          section: 1,
          isBankPaid: 1,
          date: 1,
          isCancel: 1,
          isApproved: 1,
          voucherGeneratedDate: 1,
          months: 1,
          totalPayableAmount: 1,
          logs: 1,
          feeHead: 1,
        },
      },
    ];

    const data = await feeRecordModel.aggregate(aggQuery);

    const feeHeadIds = [
      ...new Set(
        data.flatMap((entry) => entry.logs.map((log) => log?.feeHead))
      ),
    ];

    const feeHeadDetails = await feeHeadModel
      .find({ _id: { $in: feeHeadIds } })
      .select("name");

    for (let feeData of data) {
      feeData.session = {
        _id: feeData.session,
        name: currentSession,
      };
      feeData.logs.forEach((log) => {
        const feeHeadDetail = feeHeadDetails.find((fh) =>
          fh._id.equals(log.feeHead)
        );
        if (feeHeadDetail) {
          log.feeHead = feeHeadDetail;
        }
      });
    }

    const populatedData = data.map((entry) => ({
      ...entry,
      feeHead: feeHeadDetails.find((fh) => fh._id.equals(entry.feeHead)),
    }));

    res.status(200).json({ data: populatedData, status: "success" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// standard section wise transaction
exports.getStandardTotalPaid = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);
    const { session = "", student = "" } = searchData;

    const feeRecordModel = connections[req.currentSessionYear].model(
      "fee-records",
      feeRecordSchema
    );

    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    const monthsFromApril = months.slice(0, currentMonthIndex - 2);

    const currSession = session || req?.currentSession;

    const query = {};

    if (currSession) {
      query.session = new mongoose.Types.ObjectId(currSession);
    }

    if (student) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    query.month = { $in: monthsFromApril };

    const feeRecords = await feeRecordModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            section: "$section",
            standard: "$standard",
          },
          totalAmount: { $sum: "$fee" },
          totalRemainingBalance: { $sum: "$remainingAmount" },
          incrementedBalance: { $sum: "$incrementedAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          section: "$_id.section",
          standard: "$_id.standard",
          totalAmount: 1,
          totalRemainingBalance: 1,
          incrementedBalance: 1,
        },
      },
      {
        $sort: {
          standard: 1,
          section: 1,
        },
      },
    ]);

    const data = await feeRecordModel.populate(feeRecords, [
      { path: "standard" },
      { path: "section" },
    ]);

    res.status(201).send({
      data: data,
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentTotalPaidAndRemaining = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);
    const {
      session = "",
      student = "",
      standard = "",
      section = "",
    } = searchData;

    const feeRecordModel = connections[req.currentSessionYear].model(
      "fee-records",
      feeRecordSchema
    );

    connections[req.currentSessionYear].model("student", studentSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    const monthsFromApril = months.slice(0, currentMonthIndex - 2);
    // const monthsFromApril = months.slice(0);

    const query = {};

    if (standard) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    if (section) {
      query.section = new mongoose.Types.ObjectId(section);
    }

    if (student) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    query.month = { $in: monthsFromApril };

    const feeRecords = await feeRecordModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            student: "$student",
            standard: "$standard",
            section: "$section",
          },
          totalAmount: { $sum: "$fee" },
          totalDiscount: { $sum: "$totalDiscount" },
          totalRemainingBalance: { $sum: "$remainingAmount" },
          incrementedAmount: { $sum: "$incrementedAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          student: "$_id.student",
          section: "$_id.section",
          standard: "$_id.standard",
          totalAmount: 1,
          totalDiscount: 1,
          totalRemainingBalance: 1,
          incrementedAmount: 1,
        },
      },
      {
        $sort: {
          student: 1,
          standard: 1,
          section: 1,
        },
      },
    ]);

    const data = await feeRecordModel.populate(feeRecords, [
      {
        path: "student",
        select:
          "registrationNo salutation firstName middleName, lastName fatherName rollNo",
      },
      { path: "standard" },
      { path: "section" },
    ]);

    res.status(201).send({
      data: data,
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getTotalRemainingAmountHeadWise = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const {
      session = "",
      student = "",
      standard = "",
      section = "",
    } = searchData;

    const currentSession = session || req.currentSessionYear;

    const query = {};

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    connections[currentSession].model("student", studentSchema);
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("fee-head", feeHeadSchema);

    if (standard) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    if (section) {
      query.section = new mongoose.Types.ObjectId(section);
    }

    if (student) {
      if (Array.isArray(student)) {
        const studentsId = student.map(
          (stud) => new mongoose.Types.ObjectId(stud)
        );
        query.student = { $in: studentsId };
      } else {
        query.student = new mongoose.Types.ObjectId(student);
      }
    }

    const feeRecords = await feeRecordModel.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            student: "$student",
            standard: "$standard",
            section: "$section",
            feeHead: "$feeHead",
          },
          totalAmount: { $sum: "$fee" },
          totalRemainingBalance: { $sum: "$remainingAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          student: "$_id.student",
          section: "$_id.section",
          standard: "$_id.standard",
          feeHead: "$_id.feeHead",
          totalAmount: 1,
          totalRemainingBalance: 1,
        },
      },
      {
        $match: { totalRemainingBalance: { $gt: 0 } },
      },
      {
        $sort: {
          student: 1,
          standard: 1,
          section: 1,
        },
      },
    ]);

    const data = await feeRecordModel.populate(feeRecords, [
      {
        path: "student",
        select:
          "registrationNo salutation firstName middleName, lastName fatherName rollNo",
      },
      { path: "standard" },
      { path: "section" },
      { path: "feeHead" },
    ]);

    res.status(201).send({
      data: data,
      status: "Success",
    });
  } catch (error) {
    console.log("new error", error);
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const feeRecordModel = connections[req.currentSessionYear].model(
      "fee-records",
      feeRecordSchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const feeData = await feeRecordModel
      .findOne({ _id: req.params.id })
      .populate([{ path: "session" }, { path: "feeHead", select: "name" }]);
    res.status(200).json({ data: feeData, status: "success" });
  } catch (error) {
    next(next);
  }
};

exports.cancelLog = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const { logs, cancelReason, cancelDate } = req.body;

    let updatedRecords;

    for (let feeLog of logs) {
      const feeData = await feeRecordModel.findOne({ _id: feeLog._id });

      if (!feeData) {
        const error = new Error("Fee record not found");
        error.statusCode = 404;
        throw error;
      }

      const logData = feeData.log.find(
        (log) => log._id.toString() === feeLog.log?._id.toString()
      );

      if (!logData) {
        const error = new Error("Record not found");
        error.statusCode = 404;
        throw error;
      }

      const remainingBalance =
        Number(feeData.remainingAmount) + Number(logData?.payableAmount);
      const isAllPaid = remainingBalance === 0;

      feeData.remainingAmount = remainingBalance;
      feeData.isAllPaid = isAllPaid;

      logData.isCancel = true;
      logData.isApproved = false;
      logData.cancelBy = req.user._id;
      logData.cancelDate = cancelDate;
      logData.cancelReason = cancelReason;

      updatedRecords = await feeData.save();
    }

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Data Successfully Canceled!",
    });
  } catch (error) {
    next(error);
  }
};

exports.revokeLog = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const { logs, revokedReason, revokedDate } = req.body;

    let updatedRecords;

    for (let feeLog of logs) {
      const feeData = await feeRecordModel.findOne({ _id: feeLog._id });

      if (!feeData) {
        const error = new Error("Fee record not found");
        error.statusCode = 404;
        throw error;
      }

      if (feeData.remainingAmount === 0) {
        const error = new Error("Student already paid all fee!");
        error.statusCode = 409;
        throw error;
      }

      const logData = feeData.log.find(
        (log) => log._id.toString() === feeLog.log?._id.toString()
      );

      if (!logData) {
        const error = new Error("Record not found");
        error.statusCode = 404;
        throw error;
      }

      const remainingBalance =
        Number(feeData.remainingAmount) - Number(logData?.payableAmount);
      const isAllPaid = remainingBalance === 0;

      feeData.remainingAmount = remainingBalance;
      feeData.isAllPaid = isAllPaid;

      logData.isCancel = false;
      logData.isApproved = true;
      logData.revokedBy = req.user._id;
      logData.revokedDate = revokedDate;
      logData.revokedReason = revokedReason;

      updatedRecords = await feeData.save();
    }

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Data Successfully Revoked!",
    });
  } catch (error) {
    next(error);
  }
};

// Generated voucher approved functionality
exports.approvedLog = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session } = searchData;

    const currentSession = session || req.currentSessionYear;

    const { logs, date, approvedDate, transitionNo } = req.body;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    let updatedRecords;

    for (let feeLog of logs) {
      const feeData = await feeRecordModel.findOne({ _id: feeLog._id });

      if (!feeData) {
        const error = new Error("Fee record not found");
        error.statusCode = 404;
        throw error;
      }

      if (feeData.remainingAmount === 0) {
        const error = new Error("Student already paid all fee!");
        error.statusCode = 409;
        throw error;
      }

      const logData = feeData.log.find(
        (log) => log._id.toString() === feeLog.log?._id.toString()
      );

      if (!logData) {
        const error = new Error("Record not found");
        error.statusCode = 404;
        throw error;
      }

      const remainingBalance =
        Number(feeData.remainingAmount) - Number(logData?.payableAmount);
      const isAllPaid = remainingBalance === 0;

      feeData.remainingAmount = remainingBalance;
      feeData.isAllPaid = isAllPaid;

      logData.date = date;
      logData.transactionNumber = transitionNo;
      logData.isApproved = true;
      logData.approvedBy = req.user._id;
      logData.approvedDate = approvedDate;

      updatedRecords = await feeData.save();
    }

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Transaction Successfully Approved!",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const updates = req.body;
    const updatedRecords = [];
    let approvedBy = null;

    const searchData = JSON.parse(req?.query?.search);

    const { session } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const feeReceiptModel = connections[currentSession].model(
      "receipt-counter",
      receiptCounterSchema
    );

    const createdBy = req.user._id;

    // generate unique receipt number for each log record
    let seqNo;

    if (updates?.length > 0) {
      const receiptNoData = await feeReceiptModel.findOneAndUpdate(
        { id: "receipt" },
        { $inc: { receiptNo: 1 } },
        { new: true }
      );

      if (receiptNoData === null) {
        const newValue = new feeReceiptModel({
          id: "receipt",
          receiptNo: 1,
        });
        seqNo = 1;
        await newValue.save();
      } else {
        seqNo = receiptNoData?.receiptNo;
      }
    }

    for (const updateData of updates) {
      const {
        id,
        session,
        student,
        standard,
        section,
        month,
        isAllPaid,
        remainingAmount,
        log,
      } = updateData;

      if (log?.isBankPaid === false) {
        approvedBy = req.user._id;
      }

      const updatedRecord = await feeRecordModel.findOneAndUpdate(
        {
          _id: id,
          session: session,
          student: student,
          standard: standard,
          section: section,
          month: month,
        },
        {
          $push: {
            log: {
              ...log,
              receiptNo: seqNo,
              createdBy: createdBy,
              approvedBy: approvedBy,
            },
          },
          $set: {
            remainingAmount: remainingAmount,
            isAllPaid: isAllPaid,
          },
        },
        { new: true }
      );

      updatedRecords.push(updatedRecord);
    }

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Data Succeessfully Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const feeRecordModel = connections[req.currentSessionYear].model(
      "fee-records",
      feeRecordSchema
    );

    const removedData = await feeRecordModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

// update fee discount after update
exports.addFeeDiscount = async (req, res, next) => {
  try {
    const discountData = req.body;
    const session = req?.headers?.session;
    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const bulkOps = discountData.map((obj) => {
      const {
        session,
        student,
        feeHead,
        feeDiscount,
        totalDiscount,
        remainingAmount,
        isAllPaid,
      } = obj;

      const updateData = {
        $set: {
          feeDiscount: feeDiscount,
          totalDiscount: totalDiscount,
          remainingAmount: remainingAmount,
          isAllPaid: isAllPaid,
        },
      };

      return {
        updateMany: {
          filter: { feeHead, student, session, isPreviousBalance: false },
          update: updateData,
        },
      };
    });

    const data = await feeRecordModel.bulkWrite(bulkOps);

    res.status(200).json({
      data: data,
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

// particular student discount configuration

exports.discountConfiguration = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const { id, discountAmount, discountReason } = req.body;

    const existingFeeRecord = await feeRecordModel.findOne({ _id: id });

    if (!existingFeeRecord) {
      const error = new Error("Fee record not found");
      error.statusCode = 404;
      throw error;
    }

    const totalDiscount =
      existingFeeRecord.totalDiscount + Number(discountAmount);
    const remainingAmount =
      existingFeeRecord.remainingAmount - Number(discountAmount);
    const isAllPaid = remainingAmount === 0;

    existingFeeRecord.totalDiscount = totalDiscount;
    existingFeeRecord.remainingAmount = remainingAmount;
    existingFeeRecord.isAllPaid = isAllPaid;
    existingFeeRecord.discountReason = discountReason;

    const updatedRecords = await existingFeeRecord.save();

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Discount Succeessfully Applied!",
    });
  } catch (error) {
    next(error);
  }
};

// exports.feeRecordDataImport = async (req, res, next) => {
//   try {
//     const updates = req.body;

//     const updatedRecords = [];

//     const searchData = JSON.parse(req?.query?.search);
//     const { session } = searchData;
//     const currentSession = session || req.currentSessionYear;

//     const feeRecordModel = connections[currentSession].model(
//       "fee-records",
//       feeRecordSchema
//     );

//     for (const updateData of updates) {
//       const {
//         student,
//         standard,
//         section,
//         month,
//         feeHead,
//         payableAmount,
//         isCancel,
//         receiptNo,
//         cancelDate,
//         cancelReason,
//         log,
//       } = updateData;

//       const existingFeeRecord = await feeRecordModel.findOne({
//         student,
//         standard,
//         section,
//         month,
//         feeHead,
//       });

//       if (existingFeeRecord) {
//         const remainingAmount =
//           existingFeeRecord.remainingAmount - payableAmount;
//         const isAllPaid = remainingAmount === 0;
//         existingFeeRecord.isAllPaid = isAllPaid;
//         existingFeeRecord.remainingAmount = remainingAmount;

//         existingFeeRecord.log.push({
//           ...log,
//           remainingAmount,
//         });

//         await existingFeeRecord.save();
//         updatedRecords.push(existingFeeRecord);

//         if (isCancel) {
//           const feeData = await feeRecordModel.findOne({
//             student,
//             standard,
//             section,
//             month,
//             feeHead,
//           });

//           if (!feeData) {
//             const error = new Error("Fee record not found");
//             error.statusCode = 404;
//             throw error;
//           }

//           const logData = feeData.log.find(
//             (log) => log.receiptNo === receiptNo
//           );

//           if (!logData) {
//             const error = new Error("Record not found");
//             error.statusCode = 404;
//             throw error;
//           }

//           const remainingBalance =
//             Number(feeData.remainingAmount) + Number(logData?.payableAmount);
//           const isAllPaid = remainingBalance === 0;

//           feeData.remainingAmount = remainingBalance;
//           feeData.isAllPaid = isAllPaid;

//           logData.isCancel = true;
//           logData.isApproved = false;
//           logData.cancelBy = req.user._id;
//           logData.cancelDate = cancelDate;
//           logData.cancelReason = cancelReason;

//           updatedRecords = await feeData.save();
//         }
//       }
//     }

//     console.log(updatedRecords);

//     res.status(200).json({
//       data: updatedRecords,
//       status: "Success",
//       message: "Data Successfully Saved!",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.feeRecordDataImport = async (req, res, next) => {
  try {
    const updates = req.body;
    const updatedRecords = [];

    const searchData = JSON.parse(req?.query?.search);
    const { session } = searchData;
    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    for (const updateData of updates) {
      const {
        student,
        standard,
        section,
        month,
        feeHead,
        payableAmount,
        isCancel,
        receiptNo,
        cancelDate,
        cancelReason,
        log,
      } = updateData;

      const existingFeeRecord = await feeRecordModel.findOne({
        student,
        standard,
        section,
        month,
        feeHead,
      });

      if (existingFeeRecord) {
        const remainingAmount =
          existingFeeRecord.remainingAmount - payableAmount;
        const isAllPaid = remainingAmount === 0;

        existingFeeRecord.isAllPaid = isAllPaid;
        existingFeeRecord.remainingAmount = remainingAmount;

        existingFeeRecord.log.push({
          ...log,
          remainingAmount,
        });

        await existingFeeRecord.save();
        updatedRecords.push(existingFeeRecord);

        if (isCancel) {
          const feeData = await feeRecordModel.findOneAndUpdate(
            {
              student,
              standard,
              section,
              month,
              feeHead,
              "log.receiptNo": receiptNo,
            },
            {
              $set: {
                "log.$.isCancel": true,
                "log.$.isApproved": false,
                "log.$.cancelBy": req.user._id,
                "log.$.cancelDate": cancelDate,
                "log.$.cancelReason": cancelReason,
              },
            },
            { new: true }
          );

          const remainingAmount = feeData.remainingAmount + log?.payableAmount;

          feeData.remainingAmount = remainingAmount;
          feeData.isAllPaid = remainingAmount === 0;

          await feeData.save();

          if (!feeData) {
            const error = new Error("Fee record not found");
            error.statusCode = 404;
            throw error;
          }

          updatedRecords.push(feeData);
        }
      }
    }

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Data Successfully Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.feeRecordPaneltyDataImport = async (req, res, next) => {
  try {
    const updates = req.body;

    const updatedRecords = [];

    const searchData = JSON.parse(req?.query?.search);
    const { session } = searchData;
    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    for (const update of updates) {
      const { student, standard, section, month, feeHead, panelty } = update;
      const existingFeeRecord = await feeRecordModel.findOneAndUpdate(
        { student, standard, month, feeHead, section },
        { incrementedAmount: panelty },
        { new: true }
      );

      if (existingFeeRecord) {
        updatedRecords.push(existingFeeRecord);
      }
    }

    res.status(200).json({
      data: updatedRecords,
      status: "Success",
      message: "Data Successfully Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.feeRecordDiscountDataImport = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const { studentsData } = req.body;

    for (const studentData of studentsData) {
      const { student, standard, section, month, feeHead, discount } =
        studentData;

      const existingFeeRecord = await feeRecordModel.findOne({
        student,
        standard,
        month,
        feeHead,
        section,
      });

      const totalDiscount = Number(discount);
      const remainingAmount =
        existingFeeRecord.remainingAmount +
        existingFeeRecord.incrementedAmount -
        Number(discount);
      const isAllPaid = remainingAmount === 0;

      existingFeeRecord.totalDiscount = totalDiscount;
      existingFeeRecord.remainingAmount = remainingAmount;
      existingFeeRecord.isAllPaid = isAllPaid;
      existingFeeRecord.discountReason = discountReason;

      await existingFeeRecord.save();
    }

    res.status(200).json({
      data: "updatedRecords",
      status: "Success",
      message: "Discount Succeessfully Applied!",
    });
  } catch (error) {
    next(error);
  }
};

// exports.feeRecordDataImport = async (req, res, next) => {
//   try {
//     const updates = req.body;
//     const updatedRecords = [];

//     const searchData = JSON.parse(req?.query?.search);

//     const { session } = searchData;

//     const currentSession = session || req.currentSessionYear;

//     const feeRecordModel = connections[currentSession].model(
//       "fee-records",
//       feeRecordSchema
//     );

//     const feeReceiptModel = connections[currentSession].model(
//       "receipt-counter",
//       receiptCounterSchema
//     );

//     for (const updateData of updates) {
//       const { student, standard, month, feeHead, payableAmount, log } =
//         updateData;

//       const existingFeeRecord = await feeRecordModel.findOne({
//         student: student,
//         standard: standard,
//         section: section,
//         month: month,
//         feeHead: feeHead,
//       });

//       if (existingFeeRecord) {
//         const currentRemainingAmount = existingFeeRecord?.remainingAmount;
//         const remainingAmount = currentRemainingAmount - payableAmount;
//         const isAllPaid = remainingAmount === 0;
//         const logs = existingFeeRecord.log.push({
//           ...log,
//           remainingAmount: remainingAmount,
//         });

//         existingFeeRecord.isAllPaid = isAllPaid;
//         existingFeeRecord.remainingAmount = remainingAmount;
//         existingFeeRecord.log = logs;

//         // await existingFeeRecord.save();
//       }
//     }

//     res.status(200).json({
//       data: updatedRecords,
//       status: "Success",
//       message: "Data Succeessfully Saved!",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// pdf

exports.pdfLogData = async (req, searchData) => {
  try {
    const {
      session = "",
      student = "",
      isBankPaid,
      receiptNo = "",
      standard,
      section,
      isCancel,
    } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    connections[currentSession].model("session", sessionSchema);
    connections[currentSession].model("fee-head", feeHeadSchema);
    connections[currentSession].model("student", studentSchema);
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("admin", adminSchema);
    connections[currentSession].model("cast-category", castCategorySchema);

    const query = {};

    if (standard) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    if (section) {
      query.section = new mongoose.Types.ObjectId(section);
    }

    if (student) {
      query.student = new mongoose.Types.ObjectId(student);
    }

    const aggQuery = [
      {
        $match: query,
      },
      {
        $unwind: "$log",
      },
      {
        $sort: { "log.receiptNo": 1 },
      },
    ];

    if (receiptNo) {
      aggQuery.push({
        $match: {
          "log.receiptNo": Number(receiptNo),
          "log.isCancel": isCancel,
        },
      });
    }

    const data = await feeRecordModel.aggregate(aggQuery);

    const feeRecord = await feeRecordModel.populate(data, [
      { path: "session" },
      {
        path: "student",
        select:
          "firstName middleName lastName rollNo fatherName castCategory correspondenceAdd",
        populate: [{ path: "castCategory" }],
      },
      { path: "standard", select: "standard" },
      { path: "section" },
      { path: "feeHead", select: "name" },
      { path: "log.createdBy" },
      { path: "log.cancelBy" },
      { path: "log.revokedBy" },
      { path: "log.approvedBy" },
    ]);

    return feeRecord;
  } catch (error) {
    const err = new Error(error);
    error.statusCode = 422;
    throw err;
  }
};

exports.addTransportFeeRecord = async (req, res, next) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const transportFeeData = req.body;

    for (const data of transportFeeData) {
      await feeRecordModel.insertMany(data);
    }

    res.status(201).send({
      data: "savedData",
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};

exports.transportFeeRecordUpdate = async (req, res, next) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const transportFeeData = req.body;

    await feeRecordModel.deleteMany({ student: student });

    for (const data of transportFeeData) {
      await feeRecordModel.insertMany(data);
    }

    res.status(201).send({
      data: "savedData",
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};
