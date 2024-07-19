const fs = require("fs");
const mongoose = require("mongoose");

const assignmentSchema = mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },
  assignment: [
    {
      name: {
        type: String,
        required: true,
      },
      standardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "standard",
        required: true,
      },
      sectionId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "section",
          required: true,
        },
      ],
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

assignmentSchema.statics.addOrUpdateAssignment = async function (
  teacherId,
  assignment
) {
  try {
    let assignmentData = await this.findOne({ teacherId });

    if (!assignmentData) {
      assignmentData = new this({ teacherId, assignment: [assignment] });
    } else {
      assignmentData.assignment.unshift(assignment);
    }
    await assignmentData.save();
    return assignmentData;
  } catch (error) {
    throw error;
  }
};

assignmentSchema.statics.removeAssignment = async function (
  teacherId,
  assignmentId
) {
  try {
    let assignmentData = await this.findOne({ teacherId });

    if (assignmentData) {
      const removedAssignment = assignmentData.assignment.find(
        (item) => item._id.toString() === assignmentId
      );

      assignmentData.assignment = assignmentData.assignment.filter(
        (item) => item._id.toString() !== assignmentId
      );

      if (removedAssignment && removedAssignment.name) {
        fs.unlink(
          `upload/Teacher/assignment/${removedAssignment.name}`,
          (err) => {
            if (err) {
              const error = new Error(`Error deleting file: ${err}`);
              error.statusCode = 204;
              throw error;
            } else {
              console.log(`File deleted successfully`);
            }
          }
        );
      }
      return await assignmentData.save();
    }
  } catch (error) {
    throw error;
  }
};

module.exports = assignmentSchema;
