const { connections } = require("../database/config");
const adminSchema = require("../schema/admin-schema");

const postAdmin = async (req, res, next) => {
  try {
    const admin_model = connections[req.currentSessionYear].model(
      "admin",
      adminSchema
    );

    const newAdmin = new admin_model({
      name: req.body,
    });

    await newAdmin.save();

    res.status(201).send({
      status: "Success",
      message: "Admin Created!",
    });
  } catch (err) {
    next(err);
  }
};

const getAdmin = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const search = req.query.search || "";
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  const query = {
    section: { $regex: search, $options: "i" },
  };

  try {
    const admin_model = connections[req.currentSessionYear].model(
      "admin",
      adminSchema
    );

    const numbersOfData = await admin_model.find(query).count();
    const cityData = await admin_model
      .find(query)
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    res.status(200).json({ data: cityData, totalData: numbersOfData });
  } catch (error) {
    next(err);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const admin_model = connections[req.currentSessionYear].model(
      "admin",
      adminSchema
    );

    const updatedAdmin = await admin_model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      data: updatedAdmin,
      status: "Success",
      message: "Succeessfully Updated!",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const admin_model = connections[req.currentSessionYear].model(
      "admin",
      adminSchema
    );

    const removedAdmin = await admin_model.findByIdAndRemove(req.params.id);
    res
      .status(200)
      .json({ data: removedAdmin, message: "Succeessfully deleted!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { postAdmin, getAdmin, updateAdmin, deleteAdmin };
