const { connections } = require("../database/config");
const accountSchema = require("../schema/account-schema");
const accountGroupSchema = require("../schema/AccountGroup-schema");
const feeHeadSchema = require("../schema/feeHead-schema");

exports.postAccount = async (req, res, next) => {
  try {
    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    const { accountName } = req.body;

    const query = {
      accountName: { $regex: accountName, $options: "i" },
    };

    const existingAccount = await account_model.findOne(query);

    if (existingAccount) {
      const error = new Error("Account name already exists.");
      error.statusCode = 400;
      throw error;
    }

    // Create a new account
    const newAccount = new account_model(req.body);
    await newAccount.save();

    res.status(201).json({
      message: "Account created successfully",
      data: newAccount,
      status: "Success",
    });
  } catch (error) {
    next(error);
  }
};

exports.getAccount = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = req.query.perPage || 10;

  try {
    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const numbersOfData = await account_model.find().count();
    const AccountData = await account_model
      .find()
      .populate("accountGroupId")
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .sort({ accountGroupId: -1 });
    res.status(200).json({ data: AccountData, totalData: numbersOfData });
  } catch (error) {
    next(error);
  }
};

exports.getAllAccount = async (req, res, next) => {
  try {
    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const accountData = await account_model.find().sort("accountName");

    res.status(200).json({ data: accountData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.getAccountById = async (req, res, next) => {
  try {
    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const accountData = await account_model
      .findOne({ _id: req.params.id })
      .populate("accountGroupId");

    res.status(200).json({ data: accountData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateAccount = async (req, res, next) => {
  try {
    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    const updatedAccount = await account_model.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedAccount,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    const fee_model = connections[req.currentSessionYear].model(
      "fee-head",
      feeHeadSchema
    );

    const feeModalData = await fee_model.findOne({
      accountNameId: req.params.id,
    });

    if (feeModalData) {
      const error = new Error("Account name is used in fee modal collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedAccount = await account_model.findByIdAndRemove(req.params.id);
    res.status(200).json({
      data: removedAccount,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
