const { connections } = require("../database/config");
const transportIdSchema = require("../schema/transportId-schema");

exports.postData = async (req, res, next) => {
  try {
    const search = JSON.parse(req?.query?.search);

    const { session } = search;

    const currentSession = session || req.currentSessionYear;

    const transportIdModel = connections[currentSession].model(
      "transportId",
      transportIdSchema
    );

    const newData = new transportIdModel(req.body);
    const savedData = await newData.save();

    res.status(201).send({
      data: savedData,
      status: "Success",
      message: "Details Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getData = async (req, res, next) => {
  try {
    const search = JSON.parse(req?.query?.search);

    const { session } = search;

    const currentSession = session || req.currentSessionYear;

    const transportIdModel = connections[currentSession].model(
      "transportId",
      transportIdSchema
    );

    const transportId = await transportIdModel
      .find()
      .populate("transportHeadId");

    res.status(201).send({
      data: transportId,
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};
