const { connections } = require("../database/config");
const fs = require("fs");
const path = require("path");
const driverSchema = require("../schema/vehicle-driver-schema");
const vehicleDetailSchema = require("../schema/vehicle-details-schema");
const mongoose = require("mongoose");

exports.postData = async (req, res, next) => {
  try {
    const driverModel = connections[req.currentSessionYear].model(
      "vehicle-driver",
      driverSchema
    );

    const data = JSON.parse(req.body.data);

    const newData = new driverModel({
      ...data,
      validTill: data.validTill,
      photo: req.files["photo"][0].filename,
      licence: req.files["licence"][0].filename,
      aadharCard: req.files["aadharCard"][0].filename,
    });

    await newData.save();

    res.status(201).send({
      status: "Success",
      message: "Details Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getData = async (req, res, next) => {
  try {
    let page = +req.query.page + 1 || 1;
    const search = JSON.parse(req?.query?.search) || "";
    const ITEMS_PER_PAGE = +req.query.perPage || 5;

    const { vehicle = "", searchText = "" } = search;

    const driverModel = connections[req.currentSessionYear].model(
      "vehicle-driver",
      driverSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const query = {};

    if (vehicle) {
      query.vehicle = new mongoose.Types.ObjectId(vehicle);
    }

    const aggregateQuery = [];
    const countAggData = [];

    if (Object.keys(query).length !== 0) {
      aggregateQuery.push({ $match: query });
      countAggData.push({ $match: query });
    }

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
      {
        $sort: {
          name: 1,
        },
      }
    );

    countAggData.push({
      $group: {
        _id: 1,
        count: { $sum: 1 },
      },
    });

    const totalData = await driverModel.aggregate(countAggData);

    const result = await driverModel.aggregate(aggregateQuery);

    const data = await driverModel.populate(result, [
      {
        path: "vehicle",
        select: "vehicleNumber",
      },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const driverModel = connections[req.currentSessionYear].model(
      "vehicle-driver",
      driverSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const search = JSON.parse(req?.query?.search || "");
    const { vehicle } = search;

    const query = {};

    if (vehicle) {
      query.vehicle = new mongoose.Types.ObjectId(vehicle);
    }

    const aggregateQuery = [];

    if (Object.keys(query).length !== 0) {
      aggregateQuery.push({ $match: query });
    }

    aggregateQuery.push({
      $sort: {
        name: 1,
      },
    });

    const result = await driverModel.aggregate(aggregateQuery);
    const data = await driverModel.populate(result, [
      {
        path: "vehicle",
        select: "vehicleNumber",
      },
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const driverModel = connections[req.currentSessionYear].model(
      "vehicle-driver",
      driverSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const data = await driverModel
      .findOne({ _id: req.params.id })
      .populate("vehicle");

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const driverModel = connections[req.currentSessionYear].model(
      "vehicle-driver",
      driverSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const { aadharCard, licence, photo, ...data } = JSON.parse(req.body.data);
    const newData = {
      ...data,
    };

    const existingData = await driverModel.findById(req.params.id);

    const updatedFile = [];

    if (req.files) {
      for (const iterator in req.files) {
        newData[iterator] = req.files[iterator][0].filename;
        updatedFile.push(iterator);
      }
    }

    const updatedData = await driverModel.findByIdAndUpdate(req.params.id, {
      $set: newData,
    });

    for (let iterator of updatedFile) {
      const oldFileName = existingData[iterator];
      if (oldFileName) {
        if (iterator === "aadharCard") {
          iterator = "aadhar";
        }
        const filePath = path.join("upload/Driver", iterator, oldFileName);

        // Delete the file
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Successfully updated!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const driverModel = connections[req.currentSessionYear].model(
      "vehicle-driver",
      driverSchema
    );

    connections[req.currentSessionYear].model(
      "vehicle-details",
      vehicleDetailSchema
    );

    const removedData = await driverModel.findByIdAndRemove(req.params.id);

    const filePaths = [
      path.join("upload/Driver", "aadhar", removedData.aadharCard),
      path.join("upload/Driver", "licence", removedData.licence),
      path.join("upload/Driver", "photo", removedData.photo),
    ];

    filePaths.forEach((filePath) => {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        error.statusCode = 404;
        throw error;
      }
    });

    res.status(200).json({
      data: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};

exports.viewsFile = async (req, res, next) => {
  try {
    const directory = req.query.dir;

    const filePath = path.join(
      __dirname,
      "../upload/Driver/",
      directory,
      req.params.filename
    );

    if (fs.existsSync(filePath)) {
      const extname = path.extname(filePath).toLowerCase();

      let contentType = "";

      if (extname === ".pdf") {
        contentType = "application/pdf";
      } else if (extname === ".jpg" || extname === ".jpeg") {
        contentType = "image/jpeg";
      } else if (extname === ".png") {
        contentType = "image/png";
      }

      res.setHeader("Content-Type", contentType);
      const fileStream = fs.createReadStream(filePath);

      fileStream.pipe(res);
    } else {
      const error = new Error("File not found");
      error.statusCode = 404;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};
