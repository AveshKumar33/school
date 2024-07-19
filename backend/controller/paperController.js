const { connections } = require("../database/config");
const paperSchema = require("../schema/paper-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");

exports.addOrUpdatePaper = async (req, res, next) => {
  const { standard, paper, section, session = req?.currentSession } = req.body;
  const newPaper = paper?.trim();

  try {
    const paper_model = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );

    const existingPaper = await paper_model.findOne({
      session,
      standard,
      paper: { $regex: new RegExp(`^${newPaper}$`, "i") },
    });

    if (existingPaper) {
      const updatedPaper = await paper_model.findOneAndUpdate(
        {
          session,
          standard,
          paper: { $regex: new RegExp(`^${newPaper}$`, "i") },
        },
        { $addToSet: { sections: { $each: section } } },
        { new: true }
      );

      return res.status(200).json({
        data: updatedPaper,
        status: "Success",
        message: "Sections added to the existing paper.",
      });
    } else {
      const newRecord = new paper_model({
        session,
        standard,
        paper: newPaper,
        sections: section,
      });

      const savedPaper = await newRecord.save();
      return res.status(201).json({
        data: savedPaper,
        status: "Success",
        message: "New paper created.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// exports.addOrUpdatePaper = async (req, res, next) => {
//   const { standard, section, paper } = req.body;

//   try {
//     const existingDoc = await paper_model.findOneAndUpdate(
//       { standard, paper: { $regex: new RegExp(`^${paper}$`, "i") } },
//       { $addToSet: { sections: section }, $setOnInsert: { paper } },
//       { upsert: true, new: true }
//     );

//     if (existingDoc) {
//       if (existingDoc.sections.map((ele) => ele.toString()).includes(section)) {
//         return res.status(200).json({
//           data: existingDoc,
//           status: "Success",
//           message: "Paper alreay exist!.",
//         });
//       } else {
//         return res.status(201).json({
//           data: existingDoc,
//           status: "Success",
//           message: "Paper added.",
//         });
//       }
//     } else {
//       const error = new Error("Error while adding paper.");
//       error.statusCode = 422;
//       throw error;
//     }
//   } catch (error) {
//     next(error);
//   }
// };

exports.getPaper = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const search = JSON.parse(req.query.search);
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  const query = {};

  const session = search?.session || req?.currentSession;

  if (session) {
    query.session = session;
  }

  if (search?.paperName) {
    query.paper = { $regex: search?.paperName, $options: "i" };
  }

  if (search.standard) {
    query.standard = search.standard;
  }

  // if (search.section && search.section.length > 0) {
  //   query.sections = { $all: search.section };
  // }

  if (search.section) {
    if (Array.isArray(search.section) && search.section.length > 0) {
      query.sections = { $in: search.section };
    } else if (typeof search.section === "string") {
      query.sections = search.section;
    }
  }

  try {
    const paper_model = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);

    const numbersOfData = await paper_model.find(query).count();
    const paperData = await paper_model
      .find(query)
      .populate([
        {
          path: "standard",
          populate: {
            path: "sections",
          },
        },
        { path: "sections", select: "section" },
      ])
      .sort("standard")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: paperData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllPaper = async (req, res, next) => {
  try {
    const search = JSON.parse(req?.query?.search);

    const currentSession = search?.session || req?.currentSessionYear;

    const paper_model = connections[currentSession].model("paper", paperSchema);
    connections[currentSession].model("standard", standardSchema);
    connections[currentSession].model("section", sectionSchema);

    const query = {};

    if (search.standard) {
      query.standard = search.standard;
    }

    if (search.sections && search.sections.length > 0) {
      query.sections = { $all: search.sections };
    }

    const paperData = await paper_model
      .find(query)
      .populate([
        { path: "standard", select: "_id standard" },
        { path: "sections" },
      ]);
    res.status(200).json({ data: paperData });
  } catch (error) {
    next(error);
  }
};

exports.updatePaper = async (req, res, next) => {
  const { standard, section, paper } = req.body.name;

  try {
    const paper_model = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );

    const existingPaper = await paper_model.findOne({
      _id: req.params.id,
      standard,
    });

    if (!existingPaper) {
      const error = new Error("Paper not found.");
      error.statusCode = 404;
      throw error;
    }

    // Update sections if provided
    if (section) {
      existingPaper.sections = section;
    }

    // Update paper name if provided
    if (paper) {
      existingPaper.paper = paper;
    }

    const updatedPaper = await existingPaper.save();

    return res.status(200).json({
      data: updatedPaper,
      status: "Success",
      message: "Paper updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePaper = async (req, res, next) => {
  try {
    const paper_model = connections[req.currentSessionYear].model(
      "paper",
      paperSchema
    );

    const removedPaper = await paper_model.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedPaper,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
