const { connections } = require("../database/config");
const feeStructureSchema = require("../schema/fee-structure-schema");
const feeHeadSchema = require("../schema/feeHead-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const feeHeadModel = require("../schema/feeHead-schema");
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

const postFeeStructure = async (req, res, next) => {
  try {
    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    const existingData = await feeStructureModel
      .findOne({
        standard: req.body.standard,
        section: { $all: req.body.section },
      })
      .populate([{ path: "standard" }]);

    if (existingData) {
      const error = new Error(
        `${existingData.standard.standard}, Fee Structure already exist!`
      );
      error.statusCode = 409;
      throw error;
    }

    const newData = new feeStructureModel({
      ...req.body,
      session: req.currentSession,
    });

    await newData.save();

    res.status(201).send({
      status: "Success",
      message: "Details Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getFeeStructure = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 20;

  try {
    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const totalData = await feeStructureModel.aggregate([
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ]);

    const feeData = await feeStructureModel.aggregate([
      // {
      //   $sort: {
      //     standatd: 1,
      //     section: 1,
      //   },
      // },
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
    ]);

    const data = await feeStructureModel.populate(feeData, [
      { path: "name.name" },
      { path: "standard" },
      { path: "section" },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllFeeStructure = async (req, res, next) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session = "", standard = "", section } = searchData;

    const currentSession = session || req.currentSessionYear;

    const feeStructureModel = connections[currentSession].model(
      "fee-structure",
      feeStructureSchema
    );

    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("fee-head", feeHeadSchema);

    const query = {};

    if (standard) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    if (section) {
      const sectionArray = Array.isArray(section) ? section : [section];
      query.section = {
        $in: sectionArray.map((sec) => new mongoose.Types.ObjectId(sec)),
      };
    }

    const feeStructure = await feeStructureModel.aggregate([
      {
        $match: query,
      },
    ]);

    const data = await feeStructureModel.populate(feeStructure, [
      { path: "name.name" },
      { path: "standard", select: "standrad" },
      { path: "section" },
    ]);

    res.status(201).send({
      data: data,
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};

// const getFeeStructureAmountSumByMonth = async (req, res, next) => {
//   try {
//     const currentDate = new Date();
//     const currentMonthIndex = currentDate.getMonth();

//     const monthsFromApril = months.slice(0, 3 - 2);

//     console.log(monthsFromApril);

//     const feeStructure = await feeStructureModel.aggregate([
//       {
//         $match: { session: new mongoose.Types.ObjectId(req.currentSession) },
//       },
//       {
//         $unwind: "$section",
//       },
//       {
//         $lookup: {
//           from: feeHeadModel.collection.name,
//           localField: "name.name",
//           foreignField: "_id",
//           as: "feeHead",
//         },
//       },
//       {
//         $unwind: "$feeHead",
//       },
//       {
//         $match: {
//           "feeHead.paidMonth": { $in: monthsFromApril },
//         },
//       },
//       {
//         $unwind: "$name",
//       },
//       {
//         $group: {
//           _id: {
//             section: "$section",
//             standard: "$standard",
//           },
//           sum: { $sum: "$name.amount" },
//         },
//       },
//       {
//         $project: {
//           _id: 0,
//           section: "$_id.section",
//           standard: "$_id.standard",
//           sum: 1,
//         },
//       },
//     ]);

//     const data = await feeStructureModel.populate(feeStructure, [
//       { path: "standard" },
//       { path: "section" },
//     ]);

//     res.status(201).send({
//       data: data,
//       status: "Success",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const getFeeStructureAmountSumByMonth = async (req, res, next) => {
  try {
    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();

    const monthsFromApril = months.slice(0, currentMonthIndex - 2);

    const feeStructure = await feeStructureModel.aggregate([
      {
        $match: { session: new mongoose.Types.ObjectId(req.currentSession) },
      },
      {
        $unwind: "$section",
      },
      {
        $unwind: "$name",
      },
      {
        $lookup: {
          from: feeHeadModel.collection.name,
          localField: "name.name",
          foreignField: "_id",
          as: "feeHead",
        },
      },
      {
        $unwind: "$feeHead",
      },
      {
        $unwind: "$feeHead.paidMonth",
      },
      {
        $match: {
          "feeHead.paidMonth": { $in: monthsFromApril },
        },
      },
      {
        $group: {
          _id: {
            section: "$section",
            standard: "$standard",
          },
          totalAmount: { $sum: "$name.amount" },
        },
      },
      {
        $project: {
          _id: 0,
          section: "$_id.section",
          standard: "$_id.standard",
          totalAmount: 1,
        },
      },
      {
        $sort: {
          standard: 1,
          section: 1,
        },
      },
    ]);

    const data = await feeStructureModel.populate(feeStructure, [
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

const getFeeStructureById = async (req, res) => {
  try {
    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const feeData = await feeStructureModel
      .findOne({ _id: req.params.id })
      .populate([
        { path: "name.name" },
        {
          path: "standard",
          populate: {
            path: "sections",
          },
        },
        { path: "section" },
      ]);

    res.status(200).json({ data: feeData, status: "success" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message, status: "failed" });
  }
};

const updateFeeStructure = async (req, res) => {
  try {
    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    const updatedData = await feeStructureModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      data: updatedData,
      message: "Fee Structure Updated Succeessfully",
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const deleteFee = async (req, res) => {
  try {
    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    const removedData = await feeStructureModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json(removedData);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  postFeeStructure,
  getFeeStructure,
  getAllFeeStructure,
  getFeeStructureAmountSumByMonth,
  getFeeStructureById,
  updateFeeStructure,
  deleteFee,
};
