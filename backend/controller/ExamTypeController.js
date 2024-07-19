const { connections } = require("../database/config");
const examTypeSchema = require("../schema/exam-type-schema");

exports.postExamType = async (req, res, next) => {
  try {
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );

    const newExamType = new examTypeModel(req.body);

    const savedExamType = await newExamType.save();

    res.status(201).send({
      data: savedExamType,
      status: "Success",
      message: "Exam Type Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getExamType = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  try {
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );

    const numbersOfData = await examTypeModel.find().count();
    const ExamTypeData = await examTypeModel
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: ExamTypeData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllExamType = async (req, res, next) => {
  try {
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );

    const ExamTypeData = await examTypeModel.find();
    res.status(200).json({ data: ExamTypeData });
  } catch (error) {
    next(error);
  }
};

exports.updateExamType = async (req, res, next) => {
  try {
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );

    const updatedExamType = await examTypeModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedExamType,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExamType = async (req, res, next) => {
  try {
    const examTypeModel = connections[req.currentSessionYear].model(
      "exam-type",
      examTypeSchema
    );

    const removedExamType = await examTypeModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedExamType,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
