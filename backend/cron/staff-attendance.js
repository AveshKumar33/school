const cron = require("node-cron");
const { connections } = require("../database/config");
const Session = require("../schema/session-model");
const attendanceSchema = require("../schema/staff-attendance-schema");
const employeeSchema = require("../schema/employee-schema");
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

      const attendance_model = connections[sessionData.name].model(
        "staff-attendance",
        attendanceSchema
      );

      const employee_model = connections[sessionData.name].model(
        "employee",
        employeeSchema
      );

      const holidayModel = connections[sessionData.name].model(
        "holiday",
        holidaySchema
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

      const holidays = await holidayModel.find({
        startDate: { $lte: currDate },
        endDate: { $gte: currDate },
      });

      if (holidays.length > 0) {
        console.log(`Atttendance skipped on holiday: ${currDate}`);
        return;
      }

      const existingRecord = await attendance_model.findOne({ date: currDate });

      if (!existingRecord) {
        const newRecord = new attendance_model({
          session: sessionData._id,
          date: currDate,
          attendance: [],
        });

        const employees = await employee_model.find();

        employees.forEach((employee) => {
          newRecord.attendance.push({
            employee: employee._id,
            status: "present",
            leaveType: "",
            remark: "",
          });
        });

        await newRecord.save();
        console.log(`New record created for date: ${currDate}`);
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

// console.log("Cron job scheduled successfully");
