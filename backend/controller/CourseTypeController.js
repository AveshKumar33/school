const { connections } = require("../database/config");
const courseTypeSchema = require("../schema/course-type-schema");
const studentSchema = require("../schema/Student-schema");

exports.postCourseType = async (req, res, next) => {
  try {
    const courseTypeModel = connections[req.currentSessionYear].model(
      "course-type",
      courseTypeSchema
    );

    const newCourseType = new courseTypeModel(req.body);

    const sec = await newCourseType.save();

    res.status(201).send({
      data: sec,
      status: "Success",
      message: "Course Type Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getCourseType = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const search = req.query.search || "";
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  const query = {
    courseType: { $regex: search, $options: "i" },
  };

  try {
    const courseTypeModel = connections[req.currentSessionYear].model(
      "course-type",
      courseTypeSchema
    );

    const numbersOfData = await courseTypeModel.find(query).count();

    const CourseTypeData = await courseTypeModel
      .find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    //   console.log(standardData);

    res.status(200).json({ data: CourseTypeData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllCourseType = async (req, res, next) => {
  try {
    const courseTypeModel = connections[req.currentSessionYear].model(
      "course-type",
      courseTypeSchema
    );
    const CourseTypeData = await courseTypeModel.find();

    res.status(200).json({ data: CourseTypeData, status: "Success" });
  } catch (error) {
    next(next);
  }
};

exports.updateCourseType = async (req, res, next) => {
  try {
    const courseTypeModel = connections[req.currentSessionYear].model(
      "course-type",
      courseTypeSchema
    );
    const updatedCourseType = await courseTypeModel.findByIdAndUpdate(
      req.params.id,
      { $set: { courseType: req.body.name } },
      { new: true }
    );

    res.status(200).json({
      data: updatedCourseType,
      status: "Success",
      message: "Course Type Updated!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCourseType = async (req, res, next) => {
  try {
    const courseTypeModel = connections[req.currentSessionYear].model(
      "course-type",
      courseTypeSchema
    );

    const student_model = connections[req.currentSessionYear].model(
      "student",
      studentSchema
    );

    const studentData = await student_model.findOne({
      standard: req.params.id,
    });

    if (studentData) {
      const error = new Error("Course Type is used in student collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedCourseType = await courseTypeModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedCourseType,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
