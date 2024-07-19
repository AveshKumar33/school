const { connections } = require("../database/config");
const employeeSchema = require("../schema/employee-schema");
const attendanceSchema = require("../schema/staff-attendance-schema");
const designationSchema = require("../schema/designation-schema");

exports.updateAttendance = async (req, res, next) => {
  try {
    const { employee, status, leaveType, remark } = req.body;

    const attendance_model = connections[req.currentSessionYear].model(
      "staff-attendance",
      attendanceSchema
    );

    const ISTDate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });

    const date = new Date(ISTDate);
    const currDate = date.toISOString().split("T")[0];

    const existingRecord = await attendance_model.findOne({ date: currDate });

    if (existingRecord) {
      const attendance = existingRecord.attendance;

      const existingEntryIndex = attendance.findIndex(
        (entry) => entry.employee.toString() === employee
      );

      if (existingEntryIndex !== -1) {
        if (status !== undefined) {
          attendance[existingEntryIndex].status = status;
        }
        if (leaveType !== undefined) {
          attendance[existingEntryIndex].leaveType = leaveType;
        }
        if (remark !== undefined) {
          attendance[existingEntryIndex].remark = remark;
        }
      } else {
        attendance.push({ employee, status, leaveType, remark });
      }

      await existingRecord.save();

      return res.status(200).json({
        message: "Attendance marked successfully!",
      });
    } else {
      const error = new Error("No document created for attendance!");
      error.statusCode = 204;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res) => {
  const ISTDate = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });

  const date = new Date(ISTDate);
  const currDate = date.toISOString().split("T")[0];

  try {
    const attendance_model = connections[req.currentSessionYear].model(
      "staff-attendance",
      attendanceSchema
    );

    connections[req.currentSessionYear].model("employee", employeeSchema);
    connections[req.currentSessionYear].model("designation", designationSchema);

    const attendanceData = await attendance_model
      .findOne({ date: currDate })
      .populate([
        {
          path: "attendance.employee",
          select: "_id designation firstName lastName middleName mobileNo",
          populate: {
            path: "designation",
            select: "title",
          },
        },
      ]);

    res.status(200).json({ data: attendanceData });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
