const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "connections.json");

const getSessionsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Session {
  constructor(id, _id, name, startDate, endDate, connectionString, active) {
    this.id = id;
    this._id = _id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
    this.connectionString = connectionString;
    this.active = active;
  }

  save() {
    getSessionsFromFile((sessions) => {
      if (this.id) {
        const existingSessionIndex = sessions.findIndex(
          (session) => session.id === this.id
        );

        if (!this.active) {
          const activeSession = sessions.some(
            (session) => session.active === true && session.id !== this.id
          );

          if (!activeSession) {
            const error = new Error(
              "At least one other session must be active"
            );
            error.statusCode = 404;
            throw error;
          }
        }

        sessions[existingSessionIndex] = this;

        fs.writeFile(p, JSON.stringify(sessions), (err) => {
          if (err) {
            const error = new Error("Error while updating session!");
            error.statusCode = 404;
            throw error;
          }
        });
      } else {
        const lastSession = sessions[sessions.length - 1];
        this.id = lastSession ? lastSession.id + 1 : 1;

        if (!this.active) {
          sessions.push(this);
        } else {
          sessions.forEach((session) => (session.active = false));
          sessions.push(this);
        }

        fs.writeFile(p, JSON.stringify(sessions), (err) => {
          if (err) {
            const error = new Error("Error while creating session!");
            error.statusCode = 404;
            throw error;
          }
        });
      }
    });
  }

  updateData() {
    getSessionsFromFile((sessions) => {
      const existingSessionIndex = sessions.findIndex(
        (session) => Number(session.id) === Number(this.id)
      );

      this.active = this.active === "true" || this.active === true;

      if (this.active) {
        sessions.forEach((session) => (session.active = false));
      }

      sessions[existingSessionIndex] = this;

      fs.writeFile(p, JSON.stringify(sessions), (err) => {
        if (err) {
          const error = new Error("Error while updating session!");
          error.statusCode = 404;
          throw error;
        }
      });

      return sessions;
    });
  }

  static deleteById(id) {
    getSessionsFromFile((sessions) => {
      const updatedSessionData = sessions.filter(
        (s) => Number(s.id) !== Number(id)
      );

      fs.writeFile(p, JSON.stringify(updatedSessionData), (err) => {
        if (err) {
          const error = new Error("Error while deleting session!");
          error.statusCode = 404;
          throw error;
        }
      });
    });
  }

  static fetchAll(cb) {
    getSessionsFromFile(cb);
  }

  static findById(id, cb) {
    getSessionsFromFile((sessions) => {
      const session = sessions.find((s) => String(s.id) === id);
      cb(session);
    });
  }

  static activeSession(cb) {
    getSessionsFromFile((sessions) => {
      const session = sessions.find((s) => s.active === true);
      cb(session);
    });
  }
};
