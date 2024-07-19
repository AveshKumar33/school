const cron = require("node-cron");
const { connections } = require("../database/config");
const Session = require("../schema/session-model");
const attendanceSchema = require("../schema/student-attendance-schema");
const sessionSchema = require("../schema/session-year-schema");
const standardSchema = require("../schema/standard_schema");
const studentSchema = require("../schema/Student-schema");
const holidaySchema = require("../schema/holiday-schema");

// Schedule the cron job to run every day at 00:00 AM in Asia/Kolkata timezone
cron.schedule(
  "0 0 * * *",
  async () => {
    try {
      const sessionData = await new Promise((resolve, reject) => {
        Session.activeSession((sessions) => {
          resolve(sessions);
        });
      });

      const stuAttendance_model = connections[sessionData?.name].model(
        "student-attendance",
        attendanceSchema
      );

      const holidayModel = connections[sessionData.name].model(
        "holiday",
        holidaySchema
      );

      connections[sessionData?.name].model("session", sessionSchema);
      const standard_model = connections[sessionData?.name].model(
        "standard",
        standardSchema
      );
      const student_model = connections[sessionData?.name].model(
        "student",
        studentSchema
      );

      const ISTDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const date = new Date(ISTDate);
      const currDate = date.toISOString().split("T")[0];

      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0) {
        console.log(`Atttendance skipped on Sunday: ${currDate}`);
        return;
      }

      const existingRecord = await stuAttendance_model.findOne({
        session: sessionData._id,
        date: currDate,
      });

      if (!existingRecord) {
        const holidays = await holidayModel.find({
          startDate: { $lte: currDate },
          endDate: { $gte: currDate },
        });

        if (holidays.length > 0) {
          console.log(`Atttendance skipped on holiday: ${currDate}`);
          return;
        }

        const standards = await standard_model.find();

        for (const standard of standards) {
          for (const section of standard.sections) {
            const newRecord = new stuAttendance_model({
              session: sessionData?._id,
              date: currDate,
              standard: standard?._id,
              section: section,
              attendance: [],
            });

            const students = await student_model.find({
              standard: standard,
              section: section,
              isActive: true,
            });

            if (students.length > 0) {
              for (const student of students) {
                newRecord.attendance.push({
                  student: student._id,
                  status: "present",
                  leaveType: "",
                  remark: "",
                });
              }
            }
            await newRecord.save();
          }
        }
        console.log(`New record created for Date: ${currDate}`);
      } else {
        console.log(`Record already exists for date: ${currDate}`);
      }
    } catch (error) {
      console.error(error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
