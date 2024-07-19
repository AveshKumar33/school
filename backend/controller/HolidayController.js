const { connections } = require("../database/config");
const holidaySchema = require("../schema/holiday-schema");
const sessionSchema = require("../schema/session-year-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const designationSchema = require("../schema/designation-schema");

exports.postHoliday = async (req, res, next) => {
  try {
    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const newAccountGroup = new holidayModel(req.body);

    const savedAccountGroup = await newAccountGroup.save();

    res.status(201).send({
      data: savedAccountGroup,
      status: "Success",
      message: "Account Group Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getHoliday = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  const searchData = JSON.parse(req.query.search);

  const {
    title,
    session,
    section,
    standard,
    startDate,
    endDate,
    userType,
    description,
  } = searchData;

  // console.log(req.query);

  const currentSession = session || req.currentSessionYear;

  const holidayModel = connections[currentSession].model(
    "holiday",
    holidaySchema
  );

  connections[currentSession].model("session", sessionSchema);
  connections[currentSession].model("standard", standardSchema);
  connections[currentSession].model("section", sectionSchema);
  connections[currentSession].model("designation", designationSchema);

  const query = {};

  if (title) {
    query.title = { $regex: new RegExp(title, "i") };
  }

  if (description) {
    query.description = { $regex: new RegExp(description, "i") };
  }

  if (userType) {
    if (typeof userType === "string") {
      query.userType = { $all: userType.split(",") };
    } else if (Array.isArray(userType)) {
      query.userType = { $all: userType };
    }
  }

  if (standard) {
    if (typeof standard === "string") {
      query.standard = { $all: standard.split(",") };
    } else if (Array.isArray(standard)) {
      query.standard = { $all: standard };
    }
  }

  if (section) {
    if (typeof section === "string") {
      query.section = { $all: section.split(",") };
    } else if (Array.isArray(section)) {
      query.section = { $all: section };
    }
  }

  if (startDate && startDate !== "Invalid Date") {
    query.startDate = {
      $eq: new Date(startDate),
    };
  }

  if (endDate && endDate !== "Invalid Date") {
    query.endDate = {
      $eq: new Date(endDate),
    };
  }

  try {
    const numbersOfData = await holidayModel.find(query).count();
    const holidayData = await holidayModel
      .find(query)
      .populate("session")
      .populate("section")
      .populate("standard")
      .populate("userType")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.status(200).json({ data: holidayData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllHoliday = async (req, res, next) => {
  try {
    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("designation", designationSchema);

    const holidayData = await holidayModel
      .find()
      .populate("session")
      .populate("section")
      .populate("standard")
      .populate("userType");

    res.status(200).json({ data: holidayData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getHolidayById = async (req, res, next) => {
  try {
    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const holidayData = await holidayModel.findOne({ _id: req.params.id });

    res.status(200).json({ data: holidayData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateHoliday = async (req, res, next) => {
  try {
    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const updatedHoliday = await holidayModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedHoliday,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteHoliday = async (req, res, next) => {
  try {
    const holidayModel = connections[req.currentSessionYear].model(
      "holiday",
      holidaySchema
    );

    const removedHoliday = await holidayModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedHoliday,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
