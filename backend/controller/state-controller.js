const { connections } = require("../database/config");
const stateSchema = require("../schema/state-schema");
const studentSchema = require("../schema/Student-schema");
const employeeSchema = require("../schema/employee-schema");

const stateMaster = async (req, res, next) => {
  try {
    const state_model = connections[req.currentSessionYear].model(
      "state",
      stateSchema
    );

    const { _id, name } = req.body;

    const newState = new state_model({
      _id: _id,
      name: name,
    });

    await newState.save();

    res.status(201).send({
      status: "Success",
      message: "State Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getStateMaster = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 10;

  try {
    const state_model = connections[req.currentSessionYear].model(
      "state",
      stateSchema
    );

    const numbersOfData = await state_model.find().count();
    const stateData = await state_model
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort("name");
    res.status(200).json({ data: stateData, totalData: numbersOfData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllState = async (req, res, next) => {
  try {
    const state_model = connections[req.currentSessionYear].model(
      "state",
      stateSchema
    );

    const stateData = await state_model.find().sort("name");

    res.status(200).json({ data: stateData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const updateState = async (req, res, next) => {
  try {
    const state_model = connections[req.currentSessionYear].model(
      "state",
      stateSchema
    );

    const updatedState = await state_model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json({ data: updatedState, message: "State Updated Succeessfully" });
  } catch (error) {
    next(error);
  }
};

const deleteState = async (req, res, next) => {
  try {
    const state_model = connections[req.currentSessionYear].model(
      "state",
      stateSchema
    );

    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const studentData = await student_model.findOne({
      state: req.params.id,
    });
    const employeeData = await employee_model.findOne({
      state: req.params.id,
    });

    if (studentData) {
      const error = new Error("state is used in student collection!");
      error.statusCode = 405;
      throw error;
    }

    if (employeeData) {
      const error = new Error("state is used in employee collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedState = await state_model.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedState,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  stateMaster,
  getStateMaster,
  getAllState,
  updateState,
  deleteState,
};
