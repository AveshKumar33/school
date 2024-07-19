const { connections } = require("../database/config");
const stoppageSchema = require("../schema/stoppage-schema");
const vehicleRouteSchema = require("../schema/vehicle-route-schema");

exports.postStoppage = async (req, res, next) => {
  try {
    const stoppageModel = connections[req.currentSessionYear].model(
      "stoppage",
      stoppageSchema
    );

    const newStoppage = new stoppageModel(req.body);

    const savedStoppage = await newStoppage.save();

    res.status(201).send({
      data: savedStoppage,
      status: "Success",
      message: "Stoppage Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getStoppage = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  try {
    const stoppageModel = connections[req.currentSessionYear].model(
      "stoppage",
      stoppageSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );

    const numbersOfData = await stoppageModel.find().count();
    const StoppageData = await stoppageModel
      .find()
      .populate("route")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: StoppageData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllStoppage = async (req, res, next) => {
  try {
    const stoppageModel = connections[req.currentSessionYear].model(
      "stoppage",
      stoppageSchema
    );

    const query = JSON.parse(req.query.data);

    const StoppageData = await stoppageModel.find(query);
    res.status(200).json({ data: StoppageData });
  } catch (error) {
    next(error);
  }
};

exports.updateStoppage = async (req, res, next) => {
  try {
    const stoppageModel = connections[req.currentSessionYear].model(
      "stoppage",
      stoppageSchema
    );

    const updatedStoppageModal = await stoppageModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedStoppageModal,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteStoppage = async (req, res, next) => {
  try {
    const stoppageModel = connections[req.currentSessionYear].model(
      "stoppage",
      stoppageSchema
    );

    const removedStoppage = await stoppageModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedStoppage,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
