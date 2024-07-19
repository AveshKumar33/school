const { connections } = require("../database/config");
const fs = require("fs");
const path = require("path");
const citySchema = require("../schema/city-schema");
const employeeSchema = require("../schema/employee-schema");
const designationSchema = require("../schema/designation-schema");
const localitySchema = require("../schema/locality-schema");
const stateSchema = require("../schema/state-schema");
const castCategorySchema = require("../schema/cast-category-schema");
const teachingTypeSchema = require("../schema/teaching-type-schema");

const postEmployee = async (req, res, next) => {
  try {
    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const data = JSON.parse(req.body.data);

    const newData = new employee_model({
      ...data,
      photo: req.files["photo"][0].filename,
      aadharCard: req.files["aadharCard"][0].filename,
    });

    await newData.save();

    res.status(201).send({
      status: "Success",
      message: "Employee details saved!",
    });
  } catch (error) {
    next(error);
  }
};

const getEmployee = async (req, res) => {
  let page = +req.query.page + 1 || 1;
  const search = JSON.parse(req.query.search);
  const ITEMS_PER_PAGE = req.query.perPage || 10;

  const query = {
    $or: [
      { firstName: { $regex: search.searchName, $options: "i" } },
      { middleName: { $regex: search.searchName, $options: "i" } },
      { lastName: { $regex: search.searchName, $options: "i" } },
    ],
  };

  if (search.designation && search.designation.length > 0) {
    query.designation = { $in: search.designation };
  }

  try {
    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    connections[req.currentSessionYear].model(
      "cast-category",
      castCategorySchema
    );
    connections[req.currentSessionYear].model("city-master", citySchema);
    connections[req.currentSessionYear].model("locality", localitySchema);
    connections[req.currentSessionYear].model("state", stateSchema);

    const numbersOfData = await employee_model.find(query).count();
    const employeeData = await employee_model
      .find(query)
      .populate([
        { path: "castCategory" },
        {
          path: "designation",
          select: "title",
        },
        {
          path: "city",
          select: "name",
        },
        {
          path: "locality",
          select: "name",
        },
        {
          path: "state",
          select: "name",
        },
      ])
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: employeeData, totalData: numbersOfData });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const designationModel = connections[req.currentSessionYear].model(
      "designation",
      designationSchema
    );

    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const searchData = JSON.parse(req.query.data);

    const { title } = searchData;

    const aggregateQuery = [];

    aggregateQuery.push(
      {
        $sort: {
          firstName: 1,
          middleName: 1,
          lastName: 1,
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          middleName: 1,
          mobileNo: 1,
          designation: 1,
        },
      }
    );

    if (title) {
      aggregateQuery.push({
        $lookup: {
          from: designationModel.collection.name, // Replace with your designation collection name if different
          localField: "designation",
          foreignField: "_id",
          as: "designation",
        },
      });

      // aggregateQuery.push({
      //   $match: { "designation.title": { $regex: title, $options: "i" } },
      // });
    }

    const employeeData = await employee_model.aggregate(aggregateQuery);

    const data = await employee_model.populate(employeeData, [
      { path: "designation" },
    ]);

    res.status(200).json({ data: data, status: "Success" });
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

// const getAllEmployee = async (req, res) => {
//   try {
//     const query = JSON.parse(req.query.data);

//     const employeeData = await employee_model
//       .find(query)
//       .select("_id designation firstName lastName middleName mobileNo")
//       .populate([{ path: "designation" }]);

//     res.status(200).json({ data: employeeData, status: "Success" });
//   } catch (error) {
//     res.status(404).json({ status: "failed", message: error.message });
//   }
// };

const getEmployeeById = async (req, res) => {
  try {
    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    connections[req.currentSessionYear].model(
      "cast-category",
      castCategorySchema
    );
    connections[req.currentSessionYear].model("city-master", citySchema);
    connections[req.currentSessionYear].model("locality", localitySchema);
    connections[req.currentSessionYear].model("state", stateSchema);
    connections[req.currentSessionYear].model(
      "teaching-type",
      teachingTypeSchema
    );

    const employeeData = await employee_model
      .findOne({ _id: req.params.id })
      .populate([
        { path: "city" },
        { path: "locality" },
        { path: "state" },
        { path: "designation" },
        { path: "castCategory" },
        { path: "teachingType" },
      ]);
    res.status(200).json({ data: employeeData, status: "Success" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const { aadharCard, photo, ...data } = JSON.parse(req.body.data);
    const newData = {
      ...data,
    };

    const existingData = await employee_model.findById(req.params.id);

    const updatedFile = [];

    if (req.files) {
      for (const iterator in req.files) {
        newData[iterator] = req.files[iterator][0].filename;
        updatedFile.push(iterator);
      }
    }

    const updatedData = await employee_model.findByIdAndUpdate(req.params.id, {
      $set: newData,
    });

    for (let iterator of updatedFile) {
      const oldFileName = existingData[iterator];
      if (oldFileName) {
        if (iterator === "aadharCard") {
          iterator = "aadhar";
        }
        const filePath = path.join("upload/Staff", iterator, oldFileName);

        // Delete the file
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      data: updatedData,
      message: "Succeessfully updated",
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee_model = connections[req.currentSessionYear].model(
      "employee",
      employeeSchema
    );

    const removedData = await employee_model.findByIdAndRemove(req.params.id);

    const filePaths = [
      path.join("upload/Staff", "aadhar", removedData.aadharCard),
      path.join("upload/Staff", "photo", removedData.photo),
    ];

    filePaths.forEach((filePath) => {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        error.statusCode = 404;
        throw error;
      }
    });

    res.status(200).json(removedData);
  } catch (error) {
    next(error);
  }
};

const viewsFile = async (req, res, next) => {
  try {
    const directory = req.query.dir;

    const filePath = path.join(
      __dirname,
      "../upload/Staff/",
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

module.exports = {
  postEmployee,
  getEmployee,
  getAllEmployee,
  viewsFile,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
