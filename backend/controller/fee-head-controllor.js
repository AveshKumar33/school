const { connections } = require("../database/config");
const feeHeadSchema = require("../schema/feeHead-schema");
const feeStructureSchema = require("../schema/fee-structure-schema");
const accountSchema = require("../schema/account-schema");

const postFeeHead = async (req, res, next) => {
  try {
    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    const newData = new fee_model(req.body);

    await newData.save();

    res.status(201).send({
      status: "Success",
      message: "Details Saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getFeeHead = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 10;

  try {
    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    connections[req.currentSessionYear].model("account", accountSchema);

    const numbersOfData = await fee_model.find().count();
    const feeData = await fee_model
      .find()
      .populate({
        path: "accountNameId",
      })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort("name");
    res.status(200).json({ data: feeData, totalData: numbersOfData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllFeeHead = async (req, res) => {
  try {
    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    const feeData = await fee_model.find().sort("name");

    res.status(200).json({ data: feeData, status: "Success" });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const getAllFeeHeadOfSession = async (req, res) => {
  try {
    const searchData = JSON.parse(req?.query?.search);

    const { session = "" } = searchData;

    const currentSession = session || req.currentSessionYear;

    const fee_model = connections[currentSession].model(
      "fee-head",
      feeHeadSchema
    );

    const feeData = await fee_model.find().sort("name");

    res.status(200).json({ data: feeData, status: "Success" });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const getFeeHeadById = async (req, res, next) => {
  try {
    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    connections[req.currentSessionYear].model("account", accountSchema);

    const feeData = await fee_model.findOne({ _id: req.params.id }).populate({
      path: "accountNameId",
    });
    res.status(200).json({ data: feeData, status: "success" });
  } catch (error) {
    next(next);
  }
};

const updateFee = async (req, res, next) => {
  const { id } = req.params;

  try {
    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    const updatedData = await fee_model.findByIdAndUpdate(id, req.body.name, {
      new: true,
    });

    if (!updatedData) {
      const error = new Error("Fee not found");
      error.statusCode = 401;
      throw error;
    }

    res.status(200).json({
      data: updatedData,
      message: "Updated Succeessfully",
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

const deleteFee = async (req, res, next) => {
  try {
    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    const feeStructureModel = connections[req.currentSessionYear].model(
      "fee-structure",
      feeStructureSchema
    );

    const feeHeadData = await feeStructureModel.findOne({
      "name.name": req.params.id,
    });

    if (feeHeadData) {
      const error = new Error("Fee head is used in fee structure!");
      error.statusCode = 405;
      throw error;
    }

    const removedData = await fee_model.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postFeeHead,
  getFeeHeadById,
  getAllFeeHead,
  getAllFeeHeadOfSession,
  getFeeHead,
  updateFee,
  deleteFee,
};
