const mongoose = require("mongoose");
const sessionController = require("../controller/sessionController");

const connections = {};

const isValidConnectionString = (connectionString) => {
  return (
    connectionString.startsWith("mongodb://") ||
    connectionString.startsWith("mongodb+srv://")
  );
};

const connectDB = async () => {
  try {
    const sessions = await sessionController.getSessionData();

    if (!Array.isArray(sessions)) {
      console.log(
        "Invalid MONGO_URI format. Please provide an array of connections."
      );
    }

    for (const session of sessions) {
      if (!isValidConnectionString(session.connectionString)) {
        sessionController.isError(
          `Invalid connection string for ${session.name}: ${session.connectionString}`,
          session.name,
          session.id
        );
        console.error(
          `Invalid connection string for ${session.name}: ${session.connectionString}`
        );
        continue;
      }

      try {
        const conn = mongoose.createConnection(session.connectionString);
        connections[session.name] = conn;

        conn.on("error", (err) => {
          console.error(`Connection error for ${session.name}: ${err.message}`);
        });

        conn.once("open", () => {
          console.log(`Connected to ${session.name}`);
        });
      } catch (error) {
        console.error(
          `Error establishing connection to ${session.name}: ${error.message}`
        );
      }
    }

    sessionController.getConnections(connections);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = { connections, connectDB };
