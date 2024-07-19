const { connections } = require("../database/config");
const stateSchema = require("../schema/state-schema");
const postEnquirySchema = require("../schema/postEnquiry-schema");
const standardSchema = require("../schema/standard_schema");
const sectionSchema = require("../schema/section-schema");
const sessionSchema = require("../schema/session-year-schema");
const enquiryPurposeSchema = require("../schema/enquiry-purpose-schema");
const citySchema = require("../schema/city-schema");
const localitySchema = require("../schema/locality-schema");
const castCategorySchema = require("../schema/cast-category-schema");
const courseTypeSchema = require("../schema/course-type-schema");

exports.postData = async (req, res, next) => {
  try {
    const postEnquiryModel = connections[req.currentSessionYear].model(
      "post-enquiry",
      postEnquirySchema
    );

    const newpostEnquiry = new postEnquiryModel(req.body);

    const sec = await newpostEnquiry.save();

    res.status(201).send({
      data: sec,
      status: "Success",
      message: "Deatils Saved!",
    });
  } catch (error) {
    next(error);
  }
};

exports.getData = async (req, res, next) => {
  let page = +req.query.page + 1 || 1;
  const search = JSON.parse(req.query?.search);
  const ITEMS_PER_PAGE = req.query.perPage || 5;

  let query = {};

  if (search?.name) {
    const searchValue = search.name;
    const numericValue = Number(searchValue);

    if (!isNaN(numericValue)) {
      query = {
        $or: [
          { parentMobileNo: numericValue },
          { stuMobileNo: numericValue },
          { whatsappMobileNo: numericValue },
        ],
      };
    } else {
      query = {
        $or: [
          { firstName: { $regex: searchValue, $options: "i" } },
          { middleName: { $regex: searchValue, $options: "i" } },
          { lastName: { $regex: searchValue, $options: "i" } },
          { fatherName: { $regex: searchValue, $options: "i" } },
          { motherName: { $regex: searchValue, $options: "i" } },
        ],
      };
    }
  }

  if (search.session) {
    query.session = search.session;
  }

  if (search.standard) {
    query.standard = search.standard;
  }

  if (search.section) {
    query.section = search.section;
  }

  if (search.enquiryPurpose) {
    query.enquiryPurpose = search.enquiryPurpose;
  }

  try {
    const postEnquiryModel = connections[req.currentSessionYear].model(
      "post-enquiry",
      postEnquirySchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );
    connections[req.currentSessionYear].model("city-master", citySchema);
    connections[req.currentSessionYear].model("locality", localitySchema);
    connections[req.currentSessionYear].model("state", stateSchema);

    const numbersOfData = await postEnquiryModel.find(query).count();

    const postEnquirypostEnquiry = await postEnquiryModel
      .find(query)
      .populate([
        {
          path: "session",
        },
        {
          path: "enquiryPurpose",
        },
        {
          path: "standard",
          select: "standard",
        },
        {
          path: "section",
          select: "section",
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

    res.status(200).json({
      data: postEnquirypostEnquiry,
      totalData: numbersOfData,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllpostEnquiry = async (req, res, next) => {
  try {
    const postEnquiryModel = connections[req.currentSessionYear].model(
      "post-enquiry",
      postEnquirySchema
    );

    const postEnquirypostEnquiry = await postEnquiryModel.find();

    res
      .status(200)
      .json({ postEnquiry: postEnquirypostEnquiry, status: "Success" });
  } catch (error) {
    next(next);
  }
};

exports.getDataById = async (req, res, next) => {
  try {
    const postEnquiryModel = connections[req.currentSessionYear].model(
      "post-enquiry",
      postEnquirySchema
    );

    connections[req.currentSessionYear].model("session", sessionSchema);
    connections[req.currentSessionYear].model("standard", standardSchema);
    connections[req.currentSessionYear].model("section", sectionSchema);
    connections[req.currentSessionYear].model(
      "enquiry-purpose",
      enquiryPurposeSchema
    );
    connections[req.currentSessionYear].model(
      "cast-category",
      castCategorySchema
    );
    connections[req.currentSessionYear].model("city-master", citySchema);
    connections[req.currentSessionYear].model("locality", localitySchema);
    connections[req.currentSessionYear].model("state", stateSchema);
    connections[req.currentSessionYear].model("course-type", courseTypeSchema);

    const enquiaryData = await postEnquiryModel
      .findById(req.params.id)
      .populate([
        { path: "session" },
        { path: "courseType" },
        { path: "enquiryPurpose" },
        { path: "standard", populate: { path: "sections" } },
        { path: "section" },
        { path: "city", select: "name" },
        { path: "locality", select: "name" },
        { path: "state", select: "name" },
        { path: "castCategory" },
      ]);

    res.status(200).json({ data: enquiaryData, status: "Success" });
  } catch (error) {
    next(error);
  }
};

exports.updateData = async (req, res, next) => {
  try {
    const postEnquiryModel = connections[req.currentSessionYear].model(
      "post-enquiry",
      postEnquirySchema
    );

    const updatedpostEnquiry = await postEnquiryModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      postEnquiry: updatedpostEnquiry,
      status: "Success",
      message: "Successfully Updated!",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteData = async (req, res, next) => {
  try {
    const postEnquiryModel = connections[req.currentSessionYear].model(
      "post-enquiry",
      postEnquirySchema
    );

    const removedData = await postEnquiryModel.findByIdAndRemove(req.params.id);
    res.status(200).json({
      postEnquiry: removedData,
      status: "Success",
      message: "Succeessfully deleted!",
    });
  } catch (error) {
    next(error);
  }
};
