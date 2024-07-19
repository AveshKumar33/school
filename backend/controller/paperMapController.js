const { connections } = require("../database/config");
const paperMapSchema = require("../schema/paperMap-schema");
const paperSchema = require("../schema/paper-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const sessionSchema = require("../schema/session-year-schema");
const examTypeSchema = require("../schema/exam-type-schema");
const addExamSchema = require("../schema/add-exam-schema");

const mongoose = require("mongoose");

exports.postData = async (req, res, next) => {
  try {
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    const standardModel = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    const sessionModel = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );
    const paperModel = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );

    const paperData = req.body;
    const existingPaperMapData = [];
    for (const entry of paperData) {
      for (const data of entry.sections) {
        const {
          session,
          standard,
          paper,
          maxMarks,
          minMarks,
          examType,
          examName,
          weightage,
        } = entry;

        const existingDoc = await paperMapModel
          .findOne({
            session: session,
            standard: standard,
            paper: paper,
            maxMarks: maxMarks,
            minMarks: minMarks,
            examType: examType,
            examName: examName,
            weightage: weightage,
          })
          .populate([
            { path: "standard", select: "standard" },
            { path: "sections" },
            { path: "paper", select: "paper" },
          ]);

        if (existingDoc) {
          const existingData = existingDoc.sections.find(
            (d) => d._id.toString() === data.toString()
          );

          if (existingData) {
            existingPaperMapData.push({
              standard: existingDoc.standard,
              section: existingData.section,
              paper: existingDoc.paper,
            });
          } else {
            existingDoc.sections.push(data);
            await existingDoc.save();
          }
        } else {
          const {
            session,
            standard,
            paper,
            maxMarks,
            minMarks,
            examName,
            examType,
            weightage,
          } = entry;

          await paperMapModel.findOneAndUpdate(
            {
              session,
              standard,
              paper,
              examType,
              examName,
              minMarks,
              maxMarks,
              weightage,
            },
            { $addToSet: { sections: data } },
            { new: true, upsert: true }
          );
        }
      }
    }

    res.status(201).send({
      data: existingPaperMapData,
      status: "Success",
      message:
        existingPaperMapData.length > 0
          ? "Other Paper Detailed Saved!"
          : "Detailed Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const searchData = JSON.parse(req.query?.search);
  const ITEMS_PER_PAGE = +req.query.perPage || 20;

  const { session, section, standard, paper, examType, examName } = searchData;

  const curSession = session || req.currentSession;

  const query = {};

  const conditions = [];

  if (curSession) {
    conditions.push({ session: curSession });
  }

  if (standard) {
    conditions.push({ standard });
  }

  // if (section && section.length > 0) {
  //   conditions.push({ sections: { $in: section } });
  // }

  if (section) {
    if (Array.isArray(section) && section.length > 0) {
      conditions.push({ sections: { $in: section } });
    } else if (typeof section === "string") {
      conditions.push({ sections: section });
    }
  }

  if (paper && paper.length > 0) {
    conditions.push({ paper: { $in: paper } });
  }

  if (examType) {
    conditions.push({ examType });
  }

  if (examName) {
    conditions.push({ examName });
  }

  if (conditions.length > 0) {
    query.$and = conditions;
  }

  try {
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    const standardModel = connections[req.currentSessionYear].model(
      "standard",
      standardSchema
    );
    const sectionModel = connections[req.currentSessionYear].model(
      "section",
      sectionSchema
    );
    const paperModel = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );
    const sessionModel = connections[req.currentSessionYear].model(
      "session",
      sessionSchema
    );
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );
    const examModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const numbersOfData = await paperMapModel.find(query).count();
    const stuPaperMapData = await paperMapModel
      .find(query)
      .populate([
        { path: "session" },
        {
          path: "standard",
          select: "standard",
        },
        {
          path: "paper",
          select: "paper",
        },
        { path: "sections" },
        {
          path: "examType",
        },
        {
          path: "examName",
        },
      ])
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort({ standard: 1, examName: 1, examType: 1 });

    res.status(200).json({ data: stuPaperMapData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAlldata = async (req, res, next) => {
  try {
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("paper", paperSchema);
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("exam-type", examTypeSchema);
    connections[req.currentSessionYear].model("exam", addExamSchema);

    const searchData = JSON.parse(req?.query?.search) || "";

    const { sections, standard } = searchData;

    const query = {};

    const session = req.currentSession;

    if (session) {
      query.session = new mongoose.Types.ObjectId(session);
    }

    if (standard) {
      query.standard = new mongoose.Types.ObjectId(standard);
    }

    // if (examType) {
    //   query.examType = new mongoose.Types.ObjectId(examType);
    // }

    // if (examName) {
    //   query.examName = new mongoose.Types.ObjectId(examName);
    // }

    // if (sections?.length > 0) {
    //   const sectionIds = sections.map((id) => new mongoose.Types.ObjectId(id));
    //   query["sections"] = { $all: sectionIds };
    // }

    if (sections) {
      if (Array.isArray(sections) && sections.length > 0) {
        const sectionIds = sections.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        query["sections"] = { $all: sectionIds };
      } else if (typeof sections === "string") {
        query["sections"] = new mongoose.Types.ObjectId(sections);
      }
    }

    const matchQuery = {};

    const aggregateQuery = [
      {
        $match: query,
      },
      {
        $match: matchQuery,
      },
      {
        $sort: {
          standard: 1,
          examName: 1,
          examType: 1,
        },
      },
    ];

    if (sections?.length > 0) {
      const sectionIds = sections.map((id) => new mongoose.Types.ObjectId(id));
      matchQuery["sections"] = { $in: sectionIds };
    }

    const allPaperMapData = await paperMapModel.aggregate(aggregateQuery);

    const data = await paperMapModel.populate(allPaperMapData, [
      { path: "session" },
      {
        path: "standard",
        select: "standard",
      },
      {
        path: "paper",
        select: "paper",
      },
      { path: "sections" },
      {
        path: "examType",
      },
      {
        path: "examName",
      },
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("paper", paperSchema);
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("exam-type", examTypeSchema);
    connections[req.currentSessionYear].model("exam", addExamSchema);

    const paperMapData = await paperMapModel
      .findOne({ _id: req.params.id })
      .populate([
        { path: "session" },
        {
          path: "standard",
          populate: {
            path: "sections",
          },
        },
        {
          path: "paper",
          select: "paper",
        },
        { path: "sections" },
        {
          path: "examType",
        },
        {
          path: "examName",
        },
      ]);

    res.status(200).json({ data: paperMapData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );

    const paperData = req.body.name;

    const existingDoc = await paperMapModel.findOne({
      _id: req.params.id,
      session: paperData?.session,
      standard: paperData?.standard,
    });

    if (!existingDoc) {
      const error = new Error("No Data Found!");
      error.statusCode = 404;
      throw error;
    }

    // const existingPaper = await paperMapModel.findOne({
    //   session: paperData?.session,
    //   standard: paperData?.standard,
    //   paper: paperData?.paper,
    //   section: { $all: paperData?.sections },
    //   examType: paperData?.examType,
    //   maxMarks: paperData?.maxMarks,
    //   minMarks: paperData?.minMarks,
    //   weightage: paperData?.weightage,
    // });

    // if (
    //   existingPaper &&
    //   existingDoc?._id.toString() === existingPaper?._id.toString()
    // ) {
    //   const error = new Error("Document already exists with these data!");
    //   error.statusCode = 402;
    //   throw error;
    // }

    // Update the fields if they are provided in the request body
    if (paperData.paper) existingDoc.paper = paperData.paper;
    if (paperData.sections) existingDoc.sections = paperData.sections;
    if (paperData.examType) existingDoc.examType = paperData.examType;
    if (paperData.examName) existingDoc.examName = paperData.examName;
    if (paperData.minMarks) existingDoc.minMarks = paperData.minMarks;
    if (paperData.maxMarks) existingDoc.maxMarks = paperData.maxMarks;
    existingDoc.weightage = paperData.weightage;

    await existingDoc.save();

    res.status(200).send({
      data: existingDoc,
      status: "Success",
      message: "Data Updated!",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const paperMapModel = connections[req.currentSessionYear].model(
      "paper-map",
      paperMapSchema
    );

    const removedData = await paperMapModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
