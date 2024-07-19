const { connections } = require("../database/config");
const localitySchema = require("../schema/locality-schema");
const employeeSchema = require("../schema/employee-schema");
const studentSchema = require("../schema/Student-schema");

const postLocality = async (req, res, next) => {
  try {
    const locality_model = connections[req.currentSessionYear].model(
      "locality",
      localitySchema
    );

    const newCity = new locality_model({
      name: req.body.locality,
    });

    const cityData = await newCity.save();

    res.status(201).send({
      data: cityData,
      status: "Success",
      message: "Locality Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getLocality = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 5;

  try {
    const locality_model = connections[req.currentSessionYear].model(
      "locality",
      localitySchema
    );

    const numbersOfData = await locality_model.find().count();
    const localityData = await locality_model
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort("name");
    res.status(200).json({ data: localityData, totalData: numbersOfData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllLocality = async (req, res, next) => {
  try {
    const locality_model = connections[req.currentSessionYear].model(
      "locality",
      localitySchema
    );

    const localityData = await locality_model.find().sort("name");

    res.status(200).json({ data: localityData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const updateLocality = async (req, res) => {
  try {
    const locality_model = connections[req.currentSessionYear].model(
      "locality",
      localitySchema
    );

    const updatedLocality = await locality_model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      data: updatedLocality,
      status: "Success",
      message: "Locality Updated",
    });
  } catch (error) {
    res.status(409).json({ message: error.message, status: "failed" });
  }
};

const deleteLocality = async (req, res, next) => {
  try {
    const locality_model = connections[req.currentSessionYear].model(
      "locality",
      localitySchema
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
      locality: req.params.id,
    });
    const employeeData = await employee_model.findOne({
      locality: req.params.id,
    });

    if (studentData) {
      const error = new Error("Locality is used in student collection!");
      error.statusCode = 405;
      throw error;
    }

    if (employeeData) {
      const error = new Error("Locality is used in employee collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedDate = await locality_model.findByIdAndRemove(req.params.id);
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
  postLocality,
  getLocality,
  getAllLocality,
  updateLocality,
  deleteLocality,
};
