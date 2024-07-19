const Session = require("../schema/session-model");
const sessionSchema = require("../schema/session-year-schema");
const adminSchema = require("../schema/admin-schema");
// const sessionSchema = require("../schema/session-year-schema");
// const holidaySchema = require("../schema/holiday-schema");

// exports.postSessionYear = async (req, res, next) => {
//   try {
//     const sessionModel = connections[req.currentSessionYear].model(
//       "session",
//       sessionSchema
//     );

//     const newSession = new sessionModel(req.body);

//     const existingActiveSession = await sessionModel.findOne({
//       isActive: req.body.isActive,
//     });

//     if (existingActiveSession?.isActive) {
//       const error = new Error("Can't set more than one active session!.");
//       error.statusCode = 400;
//       throw error;
//     }

//     const savedSession = await newSession.save();

//     res.status(201).send({
//       data: savedSession,
//       status: "Success",
//       message: "Session Saved!",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// exports.getSessionYear = async (req, res, next) => {
//   let page = +req.query.page + 1 || 1;
//   const search = req.query.search || "";
//   const ITEMS_PER_PAGE = req.query.perPage || 5;

//   const query = {
//     section: { $regex: search, $options: "i" },
//   };

//   try {
//     const sessionModel = connections[req.currentSessionYear].model(
//       "session",
//       sessionSchema
//     );

//     const numbersOfData = await sessionModel.find(query).count();
//     const sessiondataData = await sessionModel
//       .find(query)
//       .sort({ startYear: 1 })
//       .skip((page - 1) * ITEMS_PER_PAGE)
//       .limit(ITEMS_PER_PAGE);
//     res.status(200).json({ data: sessiondataData, totalData: numbersOfData });
//   } catch (error) {
//     next(err);
//   }
// };

// exports.getAllSessionYear = async (req, res, next) => {
//   try {
//     const sessionModel = connections[req.currentSessionYear].model(
//       "session",
//       sessionSchema
//     );

//     const SessionYearData = await sessionModel
//       .find()
//       .sort("startYear")
//       .sort({ startYear: -1 });
//     res.status(200).json({ data: SessionYearData });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.updateSessionYear = async (req, res, next) => {
//   try {
//     const sessionModel = connections[req.currentSessionYear].model(
//       "session",
//       sessionSchema
//     );

//     const existingActiveSession = await sessionModel.findOne({
//       isActive: req.body.name.isActive,
//     });

//     if (existingActiveSession?.isActive) {
//       const error = new Error("Can't set more than one active session!.");
//       error.statusCode = 400;
//       throw error;
//     }

//     const updatedSessionYear = await sessionModel.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body.name },
//       { new: true }
//     );
//     res.status(200).json({
//       data: updatedSessionYear,
//       status: "Success",
//       message: "Updated Succeessfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteSessionYear = async (req, res, next) => {
//   try {
//     const sessionModel = connections[req.currentSessionYear].model(
//       "session",
//       sessionSchema
//     );

//     const holidayModel = connections[req.currentSessionYear].model(
//       "holiday",
//       holidaySchema
//     );

//     const sessionData = await holidayModel.findOne({
//       session: req.params.id,
//     });

//     if (sessionData) {
//       const error = new Error("session used in holiday collection!");
//       error.statusCode = 405;
//       throw error;
//     }

//     const removedSessionYear = await sessionModel.findByIdAndRemove(
//       req.params.id
//     );
//     res.status(200).json({
//       data: removedSessionYear,
//       status: "Success",
//       message: "Succeessfully deleted!",
//     });
//   } catch (error) {
//     next(error);
//   }
// };

let connectionError = null;
let connectionErrorSesssionName = null;
let connectionErrorSesssionId = null;
let connections = null;

exports.getConnections = (conn) => {
  connections = conn;
};

exports.isError = (error, sessionName, id) => {
  connectionError = error;
  connectionErrorSesssionName = sessionName;
  connectionErrorSesssionId = id;
};

exports.AddSession = async (req, res, next) => {
  try {
    const data = req.body;

    if (connectionErrorSesssionName) {
      const error = new Error(
        `Database not connected for session ${connectionErrorSesssionName}. Please connect connect first!`
      );
      error.statusCode = 402;
      throw error;
    }

    const session = new Session(
      null,
      null,
      data.name,
      data.startDate,
      data.endDate,
      data.connectionString,
      Boolean(data.active)
    );
    session.save();
    res.status(201).send({
      data: "savedSession",
      status: "Success",
      message: "Session Saved!",
    });
    connectionErrorSesssionName = null;
  } catch (error) {
    next(error);
  }
};

exports.getSession = (req, res, next) => {
  try {
    let page = +req.query.page + 1 || 1;
    const ITEMS_PER_PAGE = +req.query.perPage || 5;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;

    Session.fetchAll((sessions) => {
      const numbersOfData = sessions.length;
      const data = sessions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      res.status(200).json({ data, totalData: numbersOfData });
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllSession = (req, res, next) => {
  try {
    Session.fetchAll((sessions) => {
      res.status(200).json({ data: sessions });
    });
  } catch (error) {
    next(error);
  }
};

exports.getSessionById = (req, res, next) => {
  try {
    Session.findById(req.params.id, (session) => {
      res.status(200).json({ data: session });
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const data = req.body.name;

    if (data.id === connectionErrorSesssionId && data.active === true) {
      const error = new Error(
        `Database not connected for session ${connectionErrorSesssionName}`
      );
      error.statusCode = 402;
      throw error;
    }

    let session = null;

    if (data.id !== connectionErrorSesssionId && data.active === true) {
      const sessionModel = connections[data.name].model(
        "session",
        sessionSchema
      );

      const admin_model = connections[data.name].model("admin", adminSchema);

      const sessionData = await sessionModel.findOne();
      const admin = await admin_model.findOne();

      let currentDBadmin = null;

      if (!admin) {
        const admin_model = connections[req.currentSessionYear].model(
          "admin",
          adminSchema
        );

        currentDBadmin = await admin_model.findOne();
      }

      if (currentDBadmin) {
        const newAdmin = new admin_model({
          email: currentDBadmin.email,
          password: currentDBadmin.password,
          name: currentDBadmin.name,
          designation: currentDBadmin.designation,
        });

        await newAdmin.save();
      }

      if (sessionData) {
        session = await sessionModel.findByIdAndUpdate(
          sessionData._id,
          { $set: data },
          { new: true }
        );
      } else {
        const newSession = new sessionModel(data);
        session = await newSession.save();
      }
    }

    const updatedSession = new Session(
      data.id,
      session?._id,
      data.name,
      data.startDate,
      data.endDate,
      data.connectionString,
      data.active
    );

    const updatedSessionYear = updatedSession.updateData();

    res.status(200).json({
      data: updatedSessionYear,
      status: "Success",
      message: "Updated Succeessfully",
    });

    connectionErrorSesssionName = null;
    connectionErrorSesssionId = null;
  } catch (error) {
    next(error);
  }
};

exports.deleteById = async (req, res, next) => {
  try {
    const session = await new Promise((resolve, reject) => {
      Session.findById(req.params.id, (session) => {
        resolve(session);
      });
    });

    let deletedSession = null;

    if (connectionErrorSesssionName !== session.name) {
      const sessionModel = connections[session.name].model(
        "session",
        sessionSchema
      );

      const sessionData = await sessionModel.findOne();

      if (sessionData) {
        deletedSession = await User.findOneAndDelete({ id: req.params.id });
      }
    }

    if (deletedSession || connectionErrorSesssionName === session.name) {
      Session.deleteById(session.id);

      res.status(200).json({
        status: "Success",
        message: "Succeessfully deleted!",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.getSessionData = async () => {
  try {
    const sessionData = await new Promise((resolve, reject) => {
      Session.fetchAll((sessions) => {
        resolve(sessions);
      });
    });

    return sessionData;
  } catch (error) {
    throw new Error(error);
  }
};
