const { connections } = require("../database/config");
const accountGroupSchema = require("../schema/AccountGroup-schema");
const accountSchema = require("../schema/account-schema");

exports.postAccountGroup = async (req, res, next) => {
  try {
    const accountGroupModel = connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const newAccountGroup = new accountGroupModel(req.body);

    const savedAccountGroup = await newAccountGroup.save();

    res.status(201).send({
      data: savedAccountGroup,
      status: "Success",
      message: "Account Group Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAccountGroup = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 10;

  try {
    const accountGroupModel = connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const aggregateQuery = [];

    aggregateQuery.push(
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
      { $sort: { groupUnder: 1, name: 1 } }
    );

    const totalData = await accountGroupModel.aggregate([
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ]);

    const aggData = await accountGroupModel.aggregate(aggregateQuery);

    const AccountGroupData = await accountGroupModel.populate(aggData, [
      { path: "groupUnder" },
    ]);

    res
      .status(200)
      .json({ data: AccountGroupData, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

exports.getAllAccountGroup = async (req, res, next) => {
  try {
    const accountGroupModel = connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const AccountGroupData = await accountGroupModel.aggregate([
      { $sort: { name: 1 } },
    ]);
    res.status(200).json({ data: AccountGroupData });
  } catch (error) {
    next(error);
  }
};

exports.updateAccountGroup = async (req, res, next) => {
  try {
    const accountGroupModel = connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const updatedGroupModal = await accountGroupModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedGroupModal,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccountGroup = async (req, res, next) => {
  try {
    const accountGroupModel = connections[req.currentSessionYear].model(
      "account-group",
      accountGroupSchema
    );

    const account_model = connections[req.currentSessionYear].model(
      "account",
      accountSchema
    );

    const accountData = await account_model.findOne({
      accountGroupId: req.params.id,
    });

    if (accountData) {
      const error = new Error("Account Group is used in fee modal collection!");
      error.statusCode = 405;
      throw error;
    }

    const removedAccountGroup = await accountGroupModel.findByIdAndRemove(
      req.params.id
    );
    res.status(200).json({
      data: removedAccountGroup,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
