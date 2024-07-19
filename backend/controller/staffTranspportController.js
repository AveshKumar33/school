const { connections } = require("../database/config");
const staffTranspSchema = require("../schema/staff-transport-schema");
const employeeSchema = require("../schema/employee-schema");
const vehicleRouteSchema = require("../schema/vehicle-route-schema");
const stoppageSchema = require("../schema/stoppage-schema");
const sessionSchema = require("../schema/session-year-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");

exports.postData = async (req, res, next) => {
  try {
    const staffTransportModel = connections[req.currentSessionYear].model(
      "staff-transport",
      staffTranspSchema
    );

    const staffData = req.body;
    const existingStaffData = [];
    for (const entry of staffData) {
      for (const data of entry.transportData) {
        const { employee } = data;
        const { designation } = entry;

        const existingDoc = await staffTransportModel
          .findOne({
            designation: designation,
            "transportData.employee": employee,
          })
          .populate({
            path: "transportData.employee",
            select: "firstName middleName lastName",
          });

        if (existingDoc) {
          const existingStaff = existingDoc.transportData.find(
            (d) => d.employee._id.toString() === employee.toString()
          );

          if (existingStaff) {
            existingStaffData.push(existingStaff.employee);
          } else {
            existingDoc.transportData.push(data);
            await existingDoc.save();
          }
        } else {
          const { designation } = entry;

          await staffTransportModel.findOneAndUpdate(
            { designation },
            { $addToSet: { transportData: data } },
            { new: true, upsert: true }
          );
        }
      }
    }

    res.status(201).send({
      data: existingStaffData,
      status: "Success",
      message: "Detailed Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getData = async (req, res, next) => {
  const searchData = JSON.parse(req.query?.search);

  const { employee, designation, startDate, endDate } = searchData;

  const query = {};

  if (designation.length > 0) {
    query.designation = { $in: designation };
  }

  if (employee.length > 0) {
    query["transportData.employee"] = { $all: employee };
  }

  if (startDate && startDate !== "Invalid Date") {
    query["transportData.startDate"] = {
      $gte: startDate,
    };
  }

  if (endDate && endDate !== "Invalid Date") {
    query["transportData.endDate"] = {
      $lte: endDate,
    };
  }

  try {
    const staffTransportModel = connections[req.currentSessionYear].model(
      "staff-transport",
      staffTranspSchema
    );
    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);

    const numbersOfData = await staffTransportModel.find(query).count();
    const staffTranportData = await staffTransportModel.find(query).populate([
      {
        path: "transportData.route",
        populate: {
          path: "vehicle",
          select: "vehicleNumber",
        },
      },
      { path: "transportData.stoppage" },
      {
        path: "transportData.employee",
        select: "firstName middleName lastName mobileNo",
        populate: [
          {
            path: "designation",
            select: "title",
          },
        ],
      },
    ]);

    res.status(200).json({ data: staffTranportData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAlldata = async (req, res, next) => {
  try {
    const staffTransportModel = connections[req.currentSessionYear].model(
      "staff-transport",
      staffTranspSchema
    );
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);

    const stuTranportData = await staffTransportModel.find().populate([
      { path: "session" },
      { path: "standard" },
      { path: "section" },
      { path: "transportData.route" },
      { path: "transportData.stoppage" },
      {
        path: "transportData.employee",
        select: "firstName middleName lastName mobile rollNo",
      },
    ]);

    res.status(200).json({ data: stuTranportData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const staffTransportModel = connections[req.currentSessionYear].model(
      "staff-transport",
      staffTranspSchema
    );
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model(
      "vehicle-route",
      vehicleRouteSchema
    );
    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("stoppage", stoppageSchema);

    const holidayData = await staffTransportModel
      .findOne({ _id: req.params.id })
      .populate([
        { path: "session" },
        { path: "standard" },
        { path: "section" },
        { path: "transportData.route" },
        { path: "transportData.stoppage" },
        {
          path: "transportData.employee",
          select: "firstName middleName lastName mobile rollNo",
        },
      ]);

    res.status(200).json({ data: holidayData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const staffTransportModel = connections[req.currentSessionYear].model(
      "staff-transport",
      staffTranspSchema
    );

    const staffData = req.body.name;
    let updatedData = "";

    for (const entry of staffData) {
      const { designation, transportData } = entry;

      // Find the existing document
      const existingDoc = await staffTransportModel.findOne({ designation });

      if (existingDoc) {
        // Loop through the transportData to update or add new entries
        for (const data of transportData) {
          const { employee, route, stoppage, startDate, endDate, description } =
            data;

          // Check if this employee already exists in the transportData
          const existingStaff = existingDoc.transportData.find(
            (d) => d.employee.toString() === employee.toString()
          );

          if (existingStaff) {
            // If employee exists, update the details
            existingStaff.route = route;
            existingStaff.stoppage = stoppage;
            existingStaff.startDate = startDate;
            existingStaff.endDate = endDate;
            existingStaff.description = description;
          } else {
            // If employee doesn't exist, add a new entry
            updatedData = existingDoc.transportData.push(data);
          }
        }

        // Save the updated document
        await existingDoc.save();
      } else {
        const error = new Error("Staff not found!");
        error.statusCode = 404;
        throw error;
      }
    }

    res.status(200).send({
      data: updatedData,
      status: "Success",
      message: "Data Updated!",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const staffTransportModel = connections[req.currentSessionYear].model(
      "staff-transport",
      staffTranspSchema
    );

    const removedData = await staffTransportModel.findByIdAndRemove(
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
