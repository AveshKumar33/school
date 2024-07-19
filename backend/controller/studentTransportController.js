const { connections } = require("../database/config");
const studentTranspSchema = require("../schema/student-transport-schem");
const studentSchema = require("../schema/Student-schema");
const stoppageSchema = require("../schema/stoppage-schema");
const vehicleRouteSchema = require("../schema/vehicle-route-schema");
const vehicleDetailSchema = require("../schema/vehicle-details-schema");
const sessionSchema = require("../schema/session-year-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const feeRecordSchema = require("../schema/feeRecord-schema");
const transportIdSchema = require("../schema/transportId-schema");
const mongoose = require("mongoose");

exports.postDataOld = async (req, res, next) => {
  try {
    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );
    connections[req.currentSessionYear].model("student", studentSchema);

    const mData = req.body;
    const existingStudentData = [];
    const newSavedData = [];

    for (const entry of mData) {
      for (const data of entry.transportData) {
        const { student } = data;
        const { session, standard, section } = entry;

        const existingDoc = await stuTransportModel
          .findOne({
            standard: standard,
            session: session,
            section: section,
            "transportData.student": student,
          })
          .populate({
            path: "transportData.student",
            select: "firstName middleName lastName",
          });

        if (existingDoc) {
          const existingStudent = existingDoc.transportData.find(
            (d) => d.student._id.toString() === student.toString()
          );

          if (existingStudent) {
            existingStudentData.push(existingStudent.student);
          } else {
            existingDoc.transportData.push(data);
            await existingDoc.save();
            newSavedData.push({ standard, section, session, ...data });
          }
        } else {
          const { session, standard, section } = entry;

          await stuTransportModel.findOneAndUpdate(
            { session, standard, section },
            { $addToSet: { transportData: data } },
            { new: true, upsert: true }
          );
          newSavedData.push({ standard, section, session, ...data });
        }
      }
    }

    res.status(201).send({
      data: existingStudentData,
      savedData: newSavedData,
      status: "Success",
      message:
        existingStudentData.length > 0
          ? "Other Stuent Detailed Saved!"
          : "Detailed Saved!",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.postData = async (req, res, next) => {
  try {
    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );
    connections[req.currentSessionYear].model("student", studentSchema);

    const transportData = req.body;
    const existingStudentData = [];
    const newData = [];

    for (let data of transportData) {
      const { student, standard, section, month } = data;

      const existingDoc = await stuTransportModel
        .findOne({
          student: student,
          standard: standard,
          section: section,
          month: month,
        })
        .populate({
          path: "student",
          select: "firstName middleName lastName",
        });

      if (existingDoc) {
        existingStudentData.push({
          student: existingDoc.student,
          month: existingDoc.month,
        });
      } else {
        newData.push(data);
      }
    }

    let savedData;

    if (newData.length > 0) {
      savedData = await stuTransportModel.insertMany(transportData);
    }

    res.status(201).send({
      data: existingStudentData,
      savedData: savedData,
      status: "Success",
      message:
        existingStudentData.length > 0
          ? "Other Stuent Detailed Saved!"
          : "Detailed Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getDataOld = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 20;

  const searchData = JSON.parse(req.query?.search);

  const { session, section, standard, student } = searchData;

  const query = {};

  if (session) {
    query.session = new mongoose.Types.ObjectId(session);
  }

  if (standard && standard.length > 0) {
    const standardIds = standard.map((id) => new mongoose.Types.ObjectId(id));
    query.standard = { $in: standardIds };
  }

  if (section.length > 0) {
    const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
    query.section = { $in: sectionIds };
  }

  try {
    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );
    connections[req.currentSessionYear].model("student", studentSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const aggregateQuery = [];
    const countAggData = [];

    if (Object.keys(query).length !== 0) {
      aggregateQuery.push({ $match: query });
      countAggData.push({ $match: query });
    }

    aggregateQuery.push(
      { $unwind: "$transportData" },
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE }
    );

    if (student.length > 0) {
      const studentIds = student.map((id) => new mongoose.Types.ObjectId(id));
      aggregateQuery.push({
        $match: { "transportData.student": { $in: studentIds } },
      });
      countAggData.push({
        $match: { "transportData.student": { $in: studentIds } },
      });
    }

    countAggData.push(
      { $unwind: "$transportData" },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      }
    );

    const totalData = await stuTransportModel.aggregate(countAggData);

    const result = await stuTransportModel.aggregate(aggregateQuery);

    const data = await stuTransportModel.populate(result, [
      { path: "session" },
      {
        path: "transportData.route",
        populate: {
          path: "vehicle",
          select: "vehicleNumber",
        },
      },
      { path: "transportData.stoppage" },
      {
        path: "transportData.student",
        select: "firstName middleName lastName mobile rollNo",
        populate: [
          {
            path: "standard",
            select: "standard",
          },
          {
            path: "section",
            select: "section",
          },
        ],
      },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 20;

  const searchData = JSON.parse(req.query?.search);

  const { session, section, standard, student } = searchData;

  const currentSession = session || req.currentSessionYear;

  const query = {};

  if (standard && standard.length > 0) {
    const standardIds = standard.map((id) => new mongoose.Types.ObjectId(id));
    query.standard = { $in: standardIds };
  }

  if (section.length > 0) {
    const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
    query.section = { $in: sectionIds };
  }

  try {
    const stuTransportModel = connections[currentSession].model(
      "student-transport",
      studentTranspSchema
    );
    connections[currentSession].model("student", studentSchema);
    connections[currentSession].model("stoppage", stoppageSchema);
    connections[currentSession].model("vehicle-route", vehicleRouteSchema);
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("session", sessionSchema);
    connections[currentSession].model("vehicle-details", vehicleDetailSchema);

    const aggregateQuery = [];
    const countAggData = [];

    if (Object.keys(query).length !== 0) {
      aggregateQuery.push({ $match: query });
      countAggData.push({ $match: query });
    }

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE }
    );

    if (student.length > 0) {
      const studentIds = student.map((id) => new mongoose.Types.ObjectId(id));
      aggregateQuery.push({
        $match: { student: { $in: studentIds } },
      });
      countAggData.push({
        $match: { student: { $in: studentIds } },
      });
    }

    countAggData.push({
      $group: {
        _id: 1,
        count: { $sum: 1 },
      },
    });

    const totalData = await stuTransportModel.aggregate(countAggData);

    const result = await stuTransportModel.aggregate(aggregateQuery);

    const data = await stuTransportModel.populate(result, [
      { path: "session", select: "name" },
      {
        path: "route",
        populate: {
          path: "vehicle",
          select: "vehicleNumber",
        },
      },
      { path: "stoppage" },
      {
        path: "student",
        select: "firstName middleName lastName mobile rollNo",
        populate: [
          {
            path: "standard",
            select: "standard",
          },
          {
            path: "section",
            select: "section",
          },
        ],
      },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// exports.getData = async (req, res, next) => {
//   const searchData = JSON.parse(req.query?.search);

//   const { session, section, standard, startDate, endDate, student } =
//     searchData;

//   const query = {};

//   if (session) {
//     query.session = session;
//   }

//   if (standard.length > 0) {
//     query.standard = { $in: standard };
//   }

//   if (section.length > 0) {
//     query.section = { $in: section };
//   }

//   const conditions = [];

//   if (student.length > 0) {
//     conditions.push({
//       "transportData.student": { $in: student },
//     });
//   }

//   if (startDate && startDate !== "Invalid Date") {
//     conditions.push({
//       "transportData.startDate": {
//         $gte: startDate,
//       },
//     });
//   }

//   if (endDate && endDate !== "Invalid Date") {
//     conditions.push({
//       "transportData.endDate": {
//         $lte: endDate,
//       },
//     });
//   }

//   if (conditions.length > 0) {
//     query.$and = conditions;
//   }

//   try {

//     const numbersOfData = await stuTransportModel.find(query).count();
//     const stuTranportData = await stuTransportModel.find(query).populate([
//       { path: "session" },
//       {
//         path: "transportData.route",
//         populate: {
//           path: "vehicle",
//           select: "vehicleNumber",
//         },
//       },
//       { path: "transportData.stoppage" },
//       {
//         path: "transportData.student",
//         select: "firstName middleName lastName mobile rollNo",
//         populate: [
//           {
//             path: "standard",
//             select: "standard",
//           },
//           {
//             path: "section",
//             select: "section",
//           },
//         ],
//       },
//     ]);

//     res.status(200).json({ data: stuTranportData, totalData: numbersOfData });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getAlldata = async (req, res, next) => {
  try {
    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );
    connections[req.currentSessionYear].model("student", studentSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);

    const stuTranportData = await stuTransportModel.find().populate([
      { path: "session" },
      { path: "standard" },
      { path: "section" },
      { path: "route" },
      { path: "stoppage" },
      {
        path: "student",
        select: "firstName middleName lastName mobile rollNo",
      },
    ]);

    res.status(200).json({ data: stuTranportData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getDataByIdOld = async (req, res, next) => {
  try {
    const id = req.params.id;

    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );
    connections[req.currentSessionYear].model("student", studentSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const aggregateQuery = [
      { $unwind: "$transportData" },
      {
        $match: { "transportData.student": new mongoose.Types.ObjectId(id) },
      },
    ];

    const result = await stuTransportModel.aggregate(aggregateQuery);

    const data = await stuTransportModel.populate(result, [
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
        path: "transportData.route",
        populate: {
          path: "vehicle",
          select: "vehicleNumber",
        },
      },
      { path: "transportData.stoppage" },
      {
        path: "transportData.student",
        select: "firstName middleName lastName mobile rollNo",
        populate: [
          {
            path: "standard",
            select: "standard",
          },
          {
            path: "section",
            select: "section",
          },
        ],
      },
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );
    connections[req.currentSessionYear].model("student", studentSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const aggregateQuery = [
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
    ];

    const result = await stuTransportModel.aggregate(aggregateQuery);

    const data = await stuTransportModel.populate(result, [
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
        path: "route",
        populate: {
          path: "vehicle",
          select: "vehicleNumber",
        },
      },
      { path: "stoppage" },
      {
        path: "student",
        select: "firstName middleName lastName mobile rollNo",
        populate: [
          {
            path: "standard",
            select: "standard",
          },
          {
            path: "section",
            select: "section",
          },
        ],
      },
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

// exports.getDataById = async (req, res, next) => {
//   try {
//     const holidayData = await stuTransportModel
//       .findOne({ _id: req.params.id })
//       .populate([
//         { path: "session" },
//         { path: "standard" },
//         { path: "section" },
//         { path: "route" },
//         { path: "stoppage" },
//         {
//           path: "student",
//           select: "firstName middleName lastName mobile rollNo",
//         },
//       ]);

//     res.status(200).json({ data: holidayData, status: "Success" });
//   } catch (error) {
//     next(error);
//   }
// };

exports.updateDataOld = async (req, res, next) => {
  try {
    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );

    const stuData = req.body.name;
    let updatedData = "";
    let savedData = "";

    for (const entry of stuData) {
      const { session, standard, section, transportData } = entry;

      // Find the existing document
      const existingDoc = await stuTransportModel.findOne({
        standard: standard,
        session: session,
        section: section,
      });

      if (existingDoc) {
        // Loop through the transportData to update or add new entries
        for (const data of transportData) {
          const {
            student,
            route,
            stoppage,
            transportFee,
            startDate,
            endDate,
            description,
          } = data;

          // Check if this student already exists in the transportData
          const existingStaff = existingDoc?.transportData.find(
            (d) => d.student.toString() === student.toString()
          );

          if (existingStaff) {
            // If employee exists, update the details
            existingStaff.route = route;
            existingStaff.stoppage = stoppage;
            existingStaff.transportFee = transportFee;
            existingStaff.startDate = startDate;
            existingStaff.endDate = endDate;
            existingStaff.description = description;
          } else {
            // If employee doesn't exist, add a new entry
            updatedData = existingDoc.transportData.push(data);
          }
        }

        // Save the updated document
        savedData = await existingDoc.save();
      } else {
        const error = new Error("Student not found!");
        error.statusCode = 404;
        throw error;
      }
    }

    res.status(200).send({
      data: updatedData,
      updatedData: savedData,
      status: "Success",
      message: "Data Updated!",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const stuData = req.body.name.studentTransport;
    const data = stuData[0];
    const feeHead = req.body.name.feeHead;
    const sessionName = req.body.name.session;

    const currentSession = sessionName || req.currentSessionYear;

    const stuTransportModel = connections[currentSession].model(
      "student-transport",
      studentTranspSchema
    );

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    let updatedDoc;

    if (stuData.length === 1) {
      const existingFeeData = await feeRecordModel.findOne({
        student: data.student,
        standard: data.standard,
        section: data.section,
        feeHead: feeHead,
        month: data.month,
      });

      if (existingFeeData.remainingAmount !== existingFeeData.fee) {
        const error = new Error("Sorry! Can't edit.");
        error.statusCode = 300;
        throw error;
      }

      updatedDoc = await stuTransportModel.findOneAndUpdate(
        { _id: req.params.id },
        stuData[0],
        { new: true }
      );
    } else {
      const error = new Error("Sorry! Can't add new months.");
      error.statusCode = 300;
      throw error;
    }

    if (updatedDoc) {
      const updatedFeeData = await feeRecordModel.findOneAndUpdate(
        {
          student: updatedDoc.student,
          standard: updatedDoc.standard,
          section: updatedDoc.section,
          feeHead: feeHead,
          month: updatedDoc.month,
        },
        {
          fee: updatedDoc.transportFee,
          remainingAmount: updatedDoc.transportFee,
          month: updatedDoc.month,
        },
        { new: true }
      );

      console.log(updatedFeeData);
    }

    res.status(200).send({
      updatedData: "updatedDoc",
      status: "Success",
      message: "Data Updated!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDataOld = async (req, res, next) => {
  const studentIdToDelete = req.params.id;

  try {
    const stuTransportModel = connections[req.currentSessionYear].model(
      "student-transport",
      studentTranspSchema
    );

    const result = await stuTransportModel.updateOne(
      {
        "transportData.student": new mongoose.Types.ObjectId(studentIdToDelete),
      },
      { $pull: { transportData: { student: studentIdToDelete } } }
    );

    if (result) {
      res.status(200).json({
        message: "Successfully deleted!",
        status: "Success",
      });
    } else {
      res
        .status(404)
        .json({ message: "Student data not found or already removed" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const { _id, student, sessionName, month } = JSON.parse(req.headers.data);

    const currentSession = sessionName || req.currentSessionYear;

    const stuTransportModel = connections[currentSession].model(
      "student-transport",
      studentTranspSchema
    );

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const transportIdModel = connections[currentSession].model(
      "transportId",
      transportIdSchema
    );

    const removedStudentData = await stuTransportModel.findByIdAndRemove(
      req.params.id
    );

    if (removedStudentData) {
      const transportId = await transportIdModel.find();
      const transportHeadId = transportId[0].transportHeadId;

      await feeRecordModel.deleteOne({
        student: student,
        feeHead: transportHeadId,
        month: month,
      });
    }

    if (removedStudentData) {
      res.status(200).json({
        message: "Successfully deleted!",
        status: "Success",
      });
    } else {
      res
        .status(404)
        .json({ message: "Student data not found or already removed" });
    }
  } catch (error) {
    next(error);
  }
};
