const { connections } = require("../database/config");
const addExamSchema = require("../schema/add-exam-schema");

exports.postExam = async (req, res, next) => {
  try {
    const addExamModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const newExam = new addExamModel(req.body);

    const savedExam = await newExam.save();

    res.status(201).send({
      data: savedExam,
      status: "Success",
      message: "Exam Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getExam = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  try {
    const addExamModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const numbersOfData = await addExamModel.find().count();
    const ExamData = await addExamModel
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: ExamData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllExam = async (req, res, next) => {
  try {
    const addExamModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const ExamData = await addExamModel.find();
    res.status(200).json({ data: ExamData });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const addExamModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const updatedExam = await addExamModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedExam,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const addExamModel = connections[req.currentSessionYear].model(
      "exam",
      addExamSchema
    );

    const removedExam = await addExamModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedExam,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
