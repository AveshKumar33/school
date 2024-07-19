const { connections } = require("../database/config");
const vehicleRouteSchema = require("../schema/vehicle-route-schema");
const vehicleDetailSchema = require("../schema/vehicle-details-schema");

exports.postTransportRoute = async (req, res, next) => {
  try {
    const VehicleRouteModel = connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );

    const newAccountGroup = new VehicleRouteModel({
      ...req.body,
      session: req?.currentSession,
    });

    const savedAccountGroup = await newAccountGroup.save();

    res.status(201).send({
      data: savedAccountGroup,
      status: "Success",
      message: "Route Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getTransportRoute = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  try {
    const VehicleRouteModel = connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const numbersOfData = await VehicleRouteModel.find().count();
    const TransportRouteData = await VehicleRouteModel.find()
      .populate({
        path: "vehicle",
        select: "_id vehicleNumber",
      })
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res
      .status(200)
      .json({ data: TransportRouteData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransportRoute = async (req, res, next) => {
  try {
    const VehicleRouteModel = connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );

    const TransportRouteData = await VehicleRouteModel.find();
    res.status(200).json({ data: TransportRouteData });
  } catch (error) {
    next(error);
  }
};

exports.updateTransportRoute = async (req, res, next) => {
  try {
    const VehicleRouteModel = connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );

    const updatedRoute = await VehicleRouteModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedRoute,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTransportRoute = async (req, res, next) => {
  try {
    const VehicleRouteModel = connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );

    const removedTransportRoute = await VehicleRouteModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedTransportRoute,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
