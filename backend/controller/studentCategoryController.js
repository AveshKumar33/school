const { connections } = require("../database/config");
const studentCategorySchema = require("../schema/student-category-schema");

exports.postCategory = async (req, res, next) => {
  try {
    const studentCategoryModel = connections[req.currentSessionYear].model(
      "student-category",
      studentCategorySchema
    );

    const newCategory = new studentCategoryModel(req.body);

    const savedData = await newCategory.save();

    res.status(201).send({
      data: savedData,
      status: "Success",
      message: "Category Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 10;

  try {
    const studentCategoryModel = connections[req.currentSessionYear].model(
      "student-category",
      studentCategorySchema
    );

    const numbersOfData = await studentCategoryModel.find().count();
    const categoryData = await studentCategoryModel
      .find()
      .sort("name")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: categoryData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const studentCategoryModel = connections[req.currentSessionYear].model(
      "student-category",
      studentCategorySchema
    );

    const allData = await studentCategoryModel.find().sort("name");

    res.status(200).json({ data: allData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const studentCategoryModel = connections[req.currentSessionYear].model(
      "student-category",
      studentCategorySchema
    );

    const updatedData = await studentCategoryModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Category Updated",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const studentCategoryModel = connections[req.currentSessionYear].model(
      "student-category",
      studentCategorySchema
    );

    const removedDate = await studentCategoryModel.findByIdAndRemove(
      req.params.id
    );

    res.status(200).json({
      data: removedDate,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
