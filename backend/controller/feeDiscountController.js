const { connections } = require("../database/config");
const feeDiscontSchema = require("../schema/fee-discount-schema");
const feeHeadSchema = require("../schema/feeHead-schema");
const sessionSchema = require("../schema/session-year-schema");

exports.postData = async (req, res, next) => {
  try {
    const feeDiscountModel = connections[req.currentSessionYear].model(
      "fee-discount",
      feeDiscontSchema
    );

    const newData = new feeDiscountModel(req.body);

    const savedData = await newData.save();

    res.status(201).send({
      data: savedData,
      status: "Success",
      message: "Details Saved!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const ITEMS_PER_PAGE = +req.query.perPage || 10;

  try {
    const feeDiscountModel = connections[req.currentSessionYear].model(
      "fee-discount",
      feeDiscontSchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);

    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const totalData = await feeDiscountModel.aggregate([
      { $unwind: "$feeHead" },
      {
        $group: {
          _id: 1,
          count: { $sum: 1 },
        },
      },
    ]);

    const feeDiscountData = await feeDiscountModel.aggregate([
      { $unwind: "$feeHead" },
      { $skip: (page - 1) * ITEMS_PER_PAGE },
      { $limit: ITEMS_PER_PAGE },
    ]);

    const data = await feeDiscountModel.populate(feeDiscountData, [
      { path: "session", select: "name" },
      { path: "feeHead", select: "name" },
    ]);

    res.status(200).json({ data: data, totalData: totalData[0]?.count });
  } catch (error) {
    next(error);
  }
};

exports.getAllData = async (req, res, next) => {
  try {
    const search = JSON.parse(req?.query?.search);

    const { session } = search;

    const currentSession = session || req.currentSessionYear;

    const feeDiscountModel = connections[currentSession].model(
      "fee-discount",
      feeDiscontSchema
    );

    const sessionModel = connections[currentSession].model(
      "session",
      sessionSchema
    );

    const feeHeadModel = connections[currentSession].model(
      "fee-head",
      feeHeadSchema
    );

    const data = await feeDiscountModel
      .aggregate([
        {
          $unwind: "$feeHead",
        },
        {
          $lookup: {
            from: feeHeadModel.collection.name,
            localField: "feeHead",
            foreignField: "_id",
            as: "feeHeadDetails",
          },
        },
        {
          $unwind: "$feeHeadDetails", // Unwind the populated array
        },
        {
          $lookup: {
            from: sessionModel.collection.name, // Assuming you have a session model
            localField: "session",
            foreignField: "_id",
            as: "sessionDetails",
          },
        },
        {
          $unwind: "$sessionDetails", // Unwind the populated sessionDetails array
        },
        {
          $project: {
            _id: 1,
            session: "$sessionDetails",
            discountName: 1,
            discountMode: 1,
            discountValue: 1,
            description: 1,
            feeHeadDetails: {
              _id: 1,
              name: 1,
            },
          },
        },
      ])
      .exec();
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const feeDiscountModel = connections[req.currentSessionYear].model(
      "fee-discount",
      feeDiscontSchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);

    connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

    const feeData = await feeDiscountModel
      .findOne({ _id: req.params.id })
      .populate([{ path: "session" }, { path: "feeHead", select: "name" }]);
    res.status(200).json({ data: feeData, status: "success" });
  } catch (error) {
    next(next);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const feeDiscountModel = connections[req.currentSessionYear].model(
      "fee-discount",
      feeDiscontSchema
    );

    const updatedData = await feeDiscountModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body.name },
      { new: true }
    );
    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Updated Succeessfully",
    });
  } catch (error) {
    next(error);
  }
};

// exports.deleteData = async (req, res, next) => {
//   try {
//     const {_id} = JSON.parse(req.query.search);

//     const feeDiscountModel = connections[req.currentSessionYear].model(
//       "fee-discount",
//       feeDiscontSchema
//     );

//     // connections[req.currentSessionYear].model("session", sessionSchema);

//     // connections[req.currentSessionYear].model("fee-head", feeHeadSchema);

//     const existingData = await feeDiscountModel.findOne({_id: req.params.id})
//     if(!existingData){
//       const error = new Error("Record not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     const updatedFeeHead = existingData.feeHead.filter(data=> data.toString() !== _id.toString())
//     existingData.feeHead = updatedFeeHead;
//     existingData.save();

//     res.status(200).json({
//       data: "removedData",
//       status: "Success",
//       message: "Succeessfully deleted!",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.deleteData = async (req, res, next) => {
  try {
    const { id } = JSON.parse(req.query.search);

    const feeDiscountModel = connections[req.currentSessionYear].model(
      "fee-discount",
      feeDiscontSchema
    );

    const updatedData = await feeDiscountModel.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { feeHead: id } },
      { new: true }
    );

    if (updatedData.feeHead.length === 0) {
      await feeDiscountModel.findByIdAndRemove(req.params.id);
    }

    res.status(200).json({
      data: updatedData,
      status: "Success",
      message: "Successfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
