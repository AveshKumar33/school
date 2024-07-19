const { connections } = require("../database/config");
const sectionSchema = require("../schema/section-schema");
const standardSchema = require("../schema/standard_schema");
const studentSchema = require("../schema/Student-schema");
const holidaySchema = require("../schema/holiday-schema");

const postSection = async (req, res, next) => {
  try {
    const section_model = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );

    const newSection = new section_model({
      section: req.body.section,
    });

    const sec = await newSection.save();

    res.status(201).send({
      data: sec,
      status: "Success",
      message: "Section Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getSection = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const search = req.query.search || "";
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  const query = {
    section: { $regex: search, $options: "i" },
  };

  try {
    const section_model = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );

    const numbersOfData = await section_model.find(query).count();

    const sectionData = await section_model
      .find(query)
      .sort("section")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort({ section: 1 });

    //   console.log(standardData);

    res.status(200).json({ data: sectionData, totalData: numbersOfData });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const getAllSection = async (req, res, next) => {
  try {
    const section_model = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );

    const sectionData = await section_model
      .find()
      .sort("section")
      .sort({ section: 1 });

    res.status(200).json({ data: sectionData, status: "Success" });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const updateSection = async (req, res, next) => {
  try {
    const section_model = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );

    const updatedSection = await section_model.findByIdAndUpdate(
      req.params.id,
      { $set: { section: req.body.name } },
      { new: true }
    );

    res.status(200).json({
      data: updatedSection,
      status: "Success",
      message: "Section Updated!",
    });
  } catch (error) {
    next(error);
  }
};

const deleteSection = async (req, res, next) => {
  try {
    const section_model = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );
    const standard_model = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const studentData = await student_model.findOne({
      standard: req.params.id,
    });

    if (studentData) {
      const error = new Error("Section is used in student collection!");
      error.statusCode = 405;
      throw error;
    }

    const standardData = await standard_model.findOne({
      sections: req.params.id,
    });

    if (standardData) {
      const error = new Error("section is used in standard collection!");
      error.statusCode = 405;
      throw error;
    }

    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const holidayData = await holidayModel.findOne({
      standard: req.params.id,
    });

    if (holidayData) {
      const error = new Error("section is used in holiday collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedSection = await section_model.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedSection,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postSection,
  getSection,
  getAllSection,
  updateSection,
  deleteSection,
};
