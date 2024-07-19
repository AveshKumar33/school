const { connections } = require("../database/config");
const teachingTypeSchema = require("../schema/teaching-type-schema");

exports.postData = async (req, res, next) => {
  try {
    const teachingTypeModel = connections[req.currentSessionYear].model(
      "teaching-type",
      teachingTypeSchema
    );

    const newType = new teachingTypeModel(req.body);

    const savedData = await newType.save();

    res.status(201).send({
      data: savedData,
      status: "Success",
      message: "data Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 10;

  try {
    const teachingTypeModel = connections[req.currentSessionYear].model(
      "teaching-type",
      teachingTypeSchema
    );

    const numbersOfData = await teachingTypeModel.find().count();
    const data = await teachingTypeModel
      .find()
      .sort("type")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: data, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const teachingTypeModel = connections[req.currentSessionYear].model(
      "teaching-type",
      teachingTypeSchema
    );

    const allData = await teachingTypeModel.find().sort("type");

    res.status(200).json({ data: allData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const teachingTypeModel = connections[req.currentSessionYear].model(
      "teaching-type",
      teachingTypeSchema
    );

    const updatedData = await teachingTypeModel.findByIdAndUpdate(
      req.params.id,
      { $set: { type: req.body.name } },
      { new: true }
    );

    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Successfully Updated!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const teachingTypeModel = connections[req.currentSessionYear].model(
      "teaching-type",
      teachingTypeSchema
    );

    const removedDate = await teachingTypeModel.findByIdAndRemove(
      req.params.id
    );

    res.status(200).json({
      data: removedDate,
      status: "Success",
      message: "Successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
