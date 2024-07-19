const { connections } = require("../database/config");
const enquiryPurposeSchema = require("../schema/enquiry-purpose-schema");

exports.postData = async (req, res, next) => {
  try {
    const enquiryPurposeModel = connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );

    const newExamType = new enquiryPurposeModel(req.body);

    const savedExamType = await newExamType.save();

    res.status(201).send({
      data: savedExamType,
      status: "Success",
      message: "Purpose Type Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  try {
    const enquiryPurposeModel = connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );

    const numbersOfData = await enquiryPurposeModel.find().count();
    const data = await enquiryPurposeModel
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: data, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const enquiryPurposeModel = connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );

    const EnqData = await enquiryPurposeModel.find();
    res.status(200).json({ data: EnqData });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const enquiryPurposeModel = connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );

    const updatedEnqData = await enquiryPurposeModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedEnqData,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const enquiryPurposeModel = connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );

    const removedData = await enquiryPurposeModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
