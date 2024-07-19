const { connections } = require("../database/config");
const path = require("path");
const fs = require("fs");
const schoolSchema = require("../schema/school-details-schema");

exports.postData = async (req, res, next) => {
  try {
    const schoolDetailsModel = connections[req.currentSessionYear].model(
      "school-details",
      schoolSchema
    );

    const data = JSON.parse(req.body.data);
    const filename = req.files["logo"][0].filename;

    const newData = new schoolDetailsModel({ ...data, logo: filename });

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

exports.getSchoolDetails = async (req, res, next) => {
  try {
    const schoolDetailsModel = connections[req.currentSessionYear].model(
      "school-details",
      schoolSchema
    );

    const schoolData = await schoolDetailsModel.findOne();

    res.status(200).json({ data: schoolData });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const schoolDetailsModel = connections[req.currentSessionYear].model(
      "school-details",
      schoolSchema
    );

    const { logo, ...data } = JSON.parse(req.body.data);
    const newData = {
      ...data,
    };
    const existingData = await schoolDetailsModel.findById(req.params.id);

    const updatedFile = [];

    if (req.files) {
      for (const iterator in req.files) {
        newData[iterator] = req.files[iterator][0].filename;
        updatedFile.push(iterator);
      }
    }

    const updatedData = await schoolDetailsModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: newData,
      }
    );

    for (let iterator of updatedFile) {
      const oldFileName = existingData[iterator];
      if (oldFileName) {
        const filePath = path.join("upload/School", oldFileName);

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
exports.schoolDetails = async (req) => {
  try {
    const schoolDetailsModel = connections[req.currentSessionYear].model(
      "school-details",
      schoolSchema
    );

    const schoolData = await schoolDetailsModel.findOne();

    return schoolData;
  } catch (error) {
    const err = new Error(error);
    error.statusCode = 422;
    throw err;
  }
};
