const { connections } = require("../database/config");
const citySchema = require("../schema/city-schema");
const studentSchema = require("../schema/Student-schema");
const employeeSchema = require("../schema/employee-schema");

const cityMaster = async (req, res, next) => {
  try {
    const city_model = connections[req.currentSessionYear].model(
      "city-master",
      citySchema
    );

    const newCity = new city_model({
      name: req.body.city,
    });

    await newCity.save();

    res.status(201).send({
      status: "Success",
      message: "City Saved!",
    });
  } catch (err) {
    next(err);
  }
};

const getCityMaster = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const search = req.query.search || "";
  const ITEMS_PER_PAGE = +req.query.perPage || 10;

  try {
    const city_model = connections[req.currentSessionYear].model(
      "city-master",
      citySchema
    );

    const numbersOfData = await city_model.find().count();
    const cityData = await city_model
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort("name");
    res.status(200).json({ data: cityData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

const getAllCity = async (req, res, next) => {
  try {
    const city_model = connections[req.currentSessionYear].model(
      "city-master",
      citySchema
    );
    const cityData = await city_model.find().sort("name");

    res.status(200).json({ data: cityData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

const updateCity = async (req, res, next) => {
  try {
    const city_model = connections[req.currentSessionYear].model(
      "city-master",
      citySchema
    );
    const updatedCity = await city_model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json({ data: updatedCity, message: "City Updated Succeessfully" });
  } catch (error) {
    next(error);
  }
};

const deleteCity = async (req, res, next) => {
  try {
    const city_model = connections[req.currentSessionYear].model(
      "city-master",
      citySchema
    );
    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );
    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const studentData = await student_model.findOne({ city: req.params.id });
    const employeeData = await employee_model.findOne({ city: req.params.id });

    if (studentData) {
      const error = new Error("City used in student collection!");
      error.statusCode = 405;
      throw error;
    }

    if (employeeData) {
      const error = new Error("City used in employee collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedCity = await city_model.findByIdAndRemove(req.params.id);

    res.status(200).json({
      data: removedCity,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  cityMaster,
  getCityMaster,
  getAllCity,
  updateCity,
  deleteCity,
};
