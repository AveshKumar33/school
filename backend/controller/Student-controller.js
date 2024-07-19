const { connections } = require("../database/config");
const studentSchema = require("../schema/Student-schema");
const standardSchema = require("../schema/standard_schema");
const feeDiscontSchema = require("../schema/fee-discount-schema");
const sectionSchema = require("../schema/section-schema");
const sessionSchema = require("../schema/session-year-schema");
const citySchema = require("../schema/city-schema");
const castCategorySchema = require("../schema/cast-category-schema");
const localitySchema = require("../schema/locality-schema");
const stateSchema = require("../schema/state-schema");
const courseTypeSchema = require("../schema/course-type-schema");
const paperSchema = require("../schema/paper-schema");
const studentCategorySchema = require("../schema/student-category-schema");
const feeRecordSchema = require("../schema/feeRecord-schema");
const feeHeadSchema = require("../schema/feeHead-schema");
const admissionCounterModel = require("../schema/admission-counter-schema");
const regCounterModel = require("../schema/registration-counter-schema");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const postManyStudent = async (req, res) => {
  try {
    const search = JSON.parse(req?.query?.search);

    const { session } = search;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    const stuData = await student_model.insertMany(req.body);

    res.status(201).send({
      data: stuData,
      status: "Success",
      message: "All Student Details Saved!",
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const postStudent = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);

    const postSession = data?.sessionName || req.currentSessionYear;

    const student_model = connections[postSession].model(
      "student",
      studentSchema
    );

    const newStudent = new student_model({
      ...data,
      photo: req.files["photo"] ? req.files["photo"][0].filename : "",
      marksheet: req.files["marksheet"]
        ? req.files["marksheet"][0].filename
        : "",
      aadharCard: req.files["aadharCard"]
        ? req.files["aadharCard"][0].filename
        : "",
    });

    const stuData = await newStudent.save();

    // const admissionCounterData = await admissionCounterModel.findOneAndUpdate(
    //   { session: req.currentSession },
    //   { $inc: { admissionNo: 1 } },
    //   { new: true }
    // );

    // const regCounterData = await regCounterModel.findOneAndUpdate(
    //   { session: req.currentSession },
    //   { $inc: { registrationNo: 1 } },
    //   { new: true }
    // );

    // if (admissionCounterData === null) {
    //   const newValue = new admissionCounterModel({
    //     id: req.currentSession,
    //     registrationNo: 1001,
    //     admissionNo: 1,
    //   });
    //   newValue.save();
    // }

    // if (admissionCounterData === null) {
    //   const newValue = new admissionCounterModel({
    //     id: req.currentSession,
    //     registrationNo: 1001,
    //     admissionNo: 1,
    //   });
    //   newValue.save();
    // }

    res.status(201).send({
      data: stuData,
      status: "Success",
      message: "Student Details Saved!",
    });
  } catch (error) {
    res.status(203).json({ status: "failed", message: error.message });
  }
};

const getStudent = async (req, res) => {
  try {
    let page = +req.query.page + 1 || 1;
    const search = JSON.parse(req?.query?.search);
    const ITEMS_PER_PAGE = +req.query.perPage;

    const { text, standard, section, session } = search;

    const currentSession = session || req.currentSessionYear;

    const sessionModel = connections[currentSession].model(
      "session",
      sessionSchema
    );
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("cast-category", castCategorySchema);
    connections[currentSession].model(
      "student-category",
      studentCategorySchema
    );
    connections[currentSession].model("city-master", citySchema);
    connections[currentSession].model("locality", localitySchema);
    connections[currentSession].model("state", stateSchema);

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    const query = {};

    if (standard) {
      if (Array.isArray(standard) && standard.length > 0) {
        const standardIds = standard.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query.standard = { $in: standardIds };
      } else if (typeof search.standard === "string") {
        query.standard = new mongoose.Types.ObjectId(standard);
      }
    }

    if (search?.section) {
      if (Array.isArray(section) && section.length > 0) {
        const sectionIds = section.map((id) => new mongoose.Types.ObjectId(id));
        query.section = { $in: sectionIds };
      } else if (typeof section === "string") {
        query.section = new mongoose.Types.ObjectId(section);
      }
    }

    if (text) {
      const numericValue = Number(text);

      if (!isNaN(numericValue)) {
        query.$or = [
          { rollNo: numericValue },
          { admissionNo: numericValue },
          { registrationNo: text },
        ];
      } else {
        query.$or = [
          { firstName: { $regex: text, $options: "i" } },
          { middleName: { $regex: text, $options: "i" } },
          { lastName: { $regex: text, $options: "i" } },
        ];
      }
    }

    const aggregateQuery = [
      {
        $match: query,
      },
      {
        $sort: {
          standard: 1,
          section: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          rollNo: 1,
        },
      },
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
    ];

    const totalData = await student_model.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ]);

    const aggData = await student_model.aggregate(aggregateQuery);

    const studentData = await student_model.populate(aggData, [
      {
        path: "session",
        select: "name",
      },
      {
        path: "standard",
        select: "standard",
      },
      {
        path: "castCategory",
      },
      {
        path: "section",
        select: "section",
      },
      {
        path: "city",
        select: "name",
      },
      {
        path: "locality",
        select: "name",
      },
      {
        path: "state",
        select: "name",
      },
    ]);

    res
      .status(200)
      .json({ data: studentData, totalData: totalData[0]?.count || 0 });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const getAllStudent = async (req, res) => {
  try {
    const search = JSON.parse(req.query.search);

    const { session, standard, section } = search;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    connections[currentSession].model("session", sessionSchema);
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("cast-category", castCategorySchema);
    connections[currentSession].model("city-master", citySchema);
    connections[currentSession].model("locality", localitySchema);
    connections[currentSession].model("state", stateSchema);
    connections[currentSession].model("paper", paperSchema);

    const query = {
      $or: [
        { firstName: { $regex: search?.searchName || "", $options: "i" } },
        { middleName: { $regex: search?.searchName || "", $options: "i" } },
        { lastName: { $regex: search?.searchName || "", $options: "i" } },
      ],
    };

    if (search?.id) {
      query._id = search.id;
    }

    if (standard && standard.length > 0 && Array.isArray(standard)) {
      query.standard = { $in: standard };
    } else if (!Array.isArray(standard)) {
      query.standard = standard;
    }

    if (section && section.length > 0 && Array.isArray(search.section)) {
      query.section = { $in: section };
    } else if (!Array.isArray(search.section)) {
      query.section = section;
    }

    if (search?.papers && search.papers.length > 0) {
      query.paper = { $in: search.papers };
    }

    const studentData = await student_model
      .find(query)
      .populate([
        { path: "standard", select: "standard" },
        { path: "section", select: "section" },
        { path: "city", select: "name" },
        { path: "locality", select: "name" },
        { path: "state", select: "name" },
        { path: "paper", select: "paper" },
        { path: "additionalPaper", select: "paper" },
      ])
      .sort({
        standard: 1,
        section: 1,
        rollNo: 1,
        firstName: 1,
        middleName: 1,
        lastName: 1,
      });

    res.status(200).json({ data: studentData, status: "Success" });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const getAllStudentName = async (req, res, next) => {
  try {
    const search = JSON.parse(req.query.search);

    const {
      id = "",
      session = "",
      standard = "",
      section = "",
      papers,
    } = search;

    const currentSession = session || req.currentSessionYear;

    connections[currentSession].model("session", sessionSchema);

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    const query = {
      $or: [
        { firstName: { $regex: search?.searchName || "", $options: "i" } },
        { middleName: { $regex: search?.searchName || "", $options: "i" } },
        { lastName: { $regex: search?.searchName || "", $options: "i" } },
      ],
    };

    if (id) {
      query._id = new mongoose.Types.ObjectId(id);
    }

    if (standard && Array.isArray(standard) && standard.length > 0) {
      const standardId = standard.map(
        (std) => new mongoose.Types.ObjectId(std)
      );
      query.standard = { $in: standardId };
    } else if (standard && !Array.isArray(standard)) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    if (section && Array.isArray(section) && section.length > 0) {
      const sectionId = section.map((sec) => new mongoose.Types.ObjectId(sec));
      query.section = { $in: sectionId };
    } else if (section && !Array.isArray(section)) {
      query.section = new mongoose.Types.ObjectId(section);
    }

    if (papers && papers.length > 0) {
      const papersId = papers.map(
        (paper) => new mongoose.Types.ObjectId(paper)
      );
      query.paper = { $in: papersId };
    }

    const studentData = await student_model.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          _id: 1,
          salutation: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1,
          fatherName: 1,
        },
      },
    ]);

    res.status(200).json({ data: studentData, status: "Success" });
  } catch (error) {
    console.log(error);
    // next(error);
  }
};

const getStudentById = async (req, res) => {
  try {
    const search = JSON.parse(req?.query?.search);

    const { session } = search;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    connections[currentSession].model("session", sessionSchema);
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);
    connections[currentSession].model("cast-category", castCategorySchema);
    connections[currentSession].model("city-master", citySchema);
    connections[currentSession].model("locality", localitySchema);
    connections[currentSession].model("state", stateSchema);
    connections[currentSession].model("course-type", courseTypeSchema);
    connections[currentSession].model("paper", paperSchema);
    connections[currentSession].model("fee-discount", feeDiscontSchema);
    connections[currentSession].model(
      "student-category",
      studentCategorySchema
    );
    connections[currentSession].model("fee-head", feeHeadSchema);

    const aggregateQuery = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
          // session: new mongoose.Types.ObjectId(session),
        },
      },
    ];

    const aggData = await student_model.aggregate(aggregateQuery);

    const studentData = await student_model.populate(aggData, [
      { path: "session", select: "name" },
      {
        path: "standard",
        populate: {
          path: "sections",
        },
      },
      { path: "section", select: "section" },
      { path: "city", select: "name" },
      { path: "locality", select: "name" },
      { path: "state", select: "name" },
      { path: "courseType" },
      { path: "feeDiscount.feeDiscountId" },
      { path: "feeDiscount.feeHeadId" },
      { path: "studentCategory" },
      { path: "castCategory" },
      { path: "paper" },
      { path: "additionalPaper" },
    ]);

    res.status(200).json({ data: studentData, status: "Success" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getStudentCount = async (req, res, next) => {
  try {
    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const totalData = await student_model.aggregate([
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({ totalData: totalData[0]?.count || 0 });
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    const { aadharCard, marksheet, photo, ...data } = JSON.parse(req.body.data);
    const newData = {
      ...data,
    };

    const existingData = await student_model.findById(req.params.id);

    const updatedFile = [];

    if (req.files) {
      for (const iterator in req.files) {
        newData[iterator] = req.files[iterator][0].filename;
        updatedFile.push(iterator);
      }
    }
    const updatedData = await student_model.findByIdAndUpdate(
      req.params.id,
      {
        $set: newData,
      },
      { new: true }
    );

    for (let iterator of updatedFile) {
      const oldFileName = existingData[iterator];
      if (oldFileName) {
        if (iterator === "aadharCard") {
          iterator = "aadhar";
        }
        const filePath = path.join("upload/Student", iterator, oldFileName);

        // Delete the file
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Succeessfully updated!",
    });
  } catch (error) {
    next(error);
  }
};

const studentActiveInActive = async (req, res, next) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    const existingData = await student_model.findById(req.params.id);

    if (!existingData) {
      const error = new Error("Student record not found");
      error.statusCode = 404;
      throw error;
    }

    const status = existingData.isActive;
    existingData.isActive = !status;
    existingData.inActiveReason = req.body.value;

    const data = await existingData.save();

    res.status(200).json({
      data: data,
      status: "Success",
      message: "Status Successfully Updated!",
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res) => {
  try {
    const session = req?.headers?.session;

    const currentSession = session || req.currentSessionYear;

    const student_model = connections[currentSession].model(
      "student",
      studentSchema
    );

    const feeRecordModel = connections[currentSession].model(
      "fee-records",
      feeRecordSchema
    );

    const removedStudentData = await student_model.findByIdAndRemove(
      req.params.id
    );

    const filePaths = [
      path.join("upload/Student", "aadhar", removedStudentData.aadharCard),
      path.join("upload/Student", "marksheet", removedStudentData.marksheet),
      path.join("upload/Student", "photo", removedStudentData.photo),
    ];

    filePaths.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`File deleted at path: ${filePath}`);
        } else {
          console.log(`File does not exist at path: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error deleting file at path: ${filePath}`, error);
      }
    });

    if (removedStudentData) {
      await feeRecordModel.deleteMany({ student: req.params.id });
    }

    res.status(200).json({
      removedData: removedStudentData,
      status: "Success",
      message: "Standard removed!",
    });
  } catch (error) {
    res.status(409).json({ status: "failed", message: error.message });
  }
};

module.exports = {
  postManyStudent,
  postStudent,
  getStudent,
  getAllStudent,
  getAllStudentName,
  studentActiveInActive,
  getStudentById,
  getStudentCount,
  updateStudent,
  deleteStudent,
};
