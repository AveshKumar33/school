const { connections } = require("../database/config");
const vehicleDetailSchema = require("../schema/vehicle-details-schema");

exports.postVehicleDetails = async (req, res, next) => {
  try {
    const VehicleDetailsModel = connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const newAccountGroup = new VehicleDetailsModel(req.body);

    const savedAccountGroup = await newAccountGroup.save();

    res.status(201).send({
      data: savedAccountGroup,
      status: "Success",
      message: "Detailed Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getVehicle = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  try {
    const VehicleDetailsModel = connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const numbersOfData = await VehicleDetailsModel.find().count();
    const BusData = await VehicleDetailsModel.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: BusData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllVehicle = async (req, res, next) => {
  try {
    const VehicleDetailsModel = connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const vehicleData = await VehicleDetailsModel.find();
    res.status(200).json({ data: vehicleData });
  } catch (error) {
    next(err);
  }
};

exports.updateVehicleData = async (req, res, next) => {
  try {
    const VehicleDetailsModel = connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const updatedVehicleDataData = await VehicleDetailsModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedVehicleDataData,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVehicleDetails = async (req, res, next) => {
  try {
    const VehicleDetailsModel = connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const removedBus = await VehicleDetailsModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedBus,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
