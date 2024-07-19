const { connections } = require("../database/config");
const studentSchema = require("../schema/Student-schema");
const feeStructureSchema = require("../schema/fee-structure-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const holidaySchema = require("../schema/holiday-schema");

const postStandard = async (req, res, next) => {
  try {
    const standard_model = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );

    const newStandard = new standard_model({
      standard: req.body.standard,
      sections: req.body.sectionId,
    });

    const savedData = await newStandard.save();

    res.status(201).send({
      data: savedData,
      status: "Success",
      message: "Standard Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getStandard = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 20;

  try {
    const standard_model = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    connections[req.currentSessionYear].model("section", sectionSchema);

    const aggregateQuery = [];

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE }
      // {
      //   $sort: {
      //     sections: 1,
      //   },
      // }
    );

    const totalData = await standard_model.aggregate([
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ]);

    const aggData = await standard_model.aggregate(aggregateQuery);

    const standardData = await standard_model.populate(aggData, [
      { path: "sections" },
    ]);

    res
      .status(200)
      .json({ data: standardData, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

const getAllStandard = async (req, res, next) => {
  try {
    const currentSession = req.currentSessionYear;

    const standard_model = connections[currentSession].model(
      "standard",
      standardSchema
    );
    connections[currentSession].model("section", sectionSchema);

    const allData = await standard_model.find().populate("sections");

    res.status(200).json({ data: allData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const getAllStandardSessionWise = async (req, res, next) => {
  try {
    const search = JSON.parse(req.query.search);

    const { session } = search;

    const currentSession = session || req.currentSessionYear;

    const standard_model = connections[currentSession].model(
      "standard",
      standardSchema
    );
    connections[currentSession].model("section", sectionSchema);

    const allData = await standard_model.find().populate("sections");

    res.status(200).json({ data: allData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const getStandardById = async (req, res, next) => {
  try {
    const standard_model = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    connections[req.currentSessionYear].model("section", sectionSchema);

    const standardData = await standard_model
      .findOne({ _id: req.params.id })
      .populate("sections");

    res.status(200).json({ data: standardData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const updateStandard = async (req, res) => {
  try {
    const standard_model = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    connections[req.currentSessionYear].model("section", sectionSchema);

    const updatedStandard = await standard_model.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          standard: req.body.name.standard,
          sections: req.body.name.sectionId,
        },
      },
      { new: true }
    );

    res.status(200).json({
      updataddata: updatedStandard,
      status: "Success",
      message: "Standard Updated!",
    });
  } catch (error) {
    res.status(409).json({ status: "failed", message: error.message });
  }
};

const deleteStandard = async (req, res, next) => {
  try {
    const standard_model = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );

    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const studentData = await student_model.findOne({
      standard: req.params.id,
    });

    if (studentData) {
      const error = new Error("Standard is used in student collection!");
      error.statusCode = 405;
      throw error;
    }

    const feeStructureData = await feeStructureModel.findOne({
      standard: req.params.id,
    });

    if (feeStructureData) {
      const error = new Error("standard is used in fee structure collection!");
      error.statusCode = 405;
      throw error;
    }

    const holidayData = await holidayModel.findOne({
      standard: req.params.id,
    });

    if (holidayData) {
      const error = new Error("standard is used in holiday collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedStandard = await standard_model.findByIdAndRemove(
      req.params.id
    );
    res
      .status(200)
      .json({ data: removedStandard, message: "Succeessfully deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postStandard,
  getStandard,
  getStandardById,
  getAllStandard,
  getAllStandardSessionWise,
  updateStandard,
  deleteStandard,
};
