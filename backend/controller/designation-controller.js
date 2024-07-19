const { connections } = require("../database/config");
const designationSchema = require("../schema/designation-schema");
const employeeSchema = require("../schema/employee-schema");
const holidaySchema = require("../schema/holiday-schema");

const postDesignation = async (req, res, next) => {
  try {
    const designation_model = connections[req.currentSessionYear].model(
      "designation",
      designationSchema
    );

    const newDesig = new designation_model(req.body);

    const designtion = await newDesig.save();

    res.status(201).send({
      data: designtion,
      status: "Success",
      message: "Designation Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getDesignation = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 10;

  try {
    const designation_model = connections[req.currentSessionYear].model(
      "designation",
      designationSchema
    );
    const numbersOfData = await designation_model.find().count();
    const localityData = await designation_model
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort("title");
    res.status(200).json({ data: localityData, totalData: numbersOfData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllDesigntion = async (req, res, next) => {
  try {
    const designation_model = connections[req.currentSessionYear].model(
      "designation",
      designationSchema
    );

    const allData = await designation_model.find().sort("title");

    res.status(200).json({ data: allData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const updateDesignation = async (req, res) => {
  try {
    const designation_model = connections[req.currentSessionYear].model(
      "designation",
      designationSchema
    );
    const updatedLocality = await designation_model.findByIdAndUpdate(
      req.params.id,
      { $set: { title: req.body.name } },
      { new: true }
    );

    res.status(200).json({
      data: updatedLocality,
      status: "Success",
      message: "Designation Updated",
    });
  } catch (error) {
    res.status(409).json({ message: error.message, status: "failed" });
  }
};

const deleteDesignation = async (req, res, next) => {
  try {
    const designation_model = connections[req.currentSessionYear].model(
      "designation",
      designationSchema
    );

    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const employeeData = await employee_model.findOne({
      designation: req.params.id,
    });

    const holidayData = await holidayModel.findOne({
      userType: req.params.id,
    });

    if (employeeData) {
      const error = new Error("designation is used in employee collection!");
      error.statusCode = 405;
      throw error;
    }

    if (holidayData) {
      const error = new Error("designation is used in holiday collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedDate = await designation_model.findByIdAndRemove(
      req.params.id
    );

    res.status(200).json({
      data: removedDate,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postDesignation,
  getDesignation,
  getAllDesigntion,
  updateDesignation,
  deleteDesignation,
};
