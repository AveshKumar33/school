const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    switch (file.fieldname) {
      case "marksheet":
        callback(null, path.join(__dirname, "../upload/Student/marksheet"));
        break;
      case "aadharCard":
        callback(null, path.join(__dirname, "../upload/Student/aadhar"));
        break;
      case "photo":
        callback(null, path.join(__dirname, "../upload/Student/photo"));
        break;
      case "assignment":
        callback(null, path.join(__dirname, "../upload/Teacher/assignment"));
        break;
      case "logo":
        callback(null, path.join(__dirname, "../upload/School"));
        break;
      default:
        callback(null, path.join(__dirname, "../upload"));
        break;
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
const uploadMany = multer({ storage: storage }).fields([
  { name: "marksheet", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "assignment", maxCount: 1 },
  { name: "logo", maxCount: 1 },
]);
module.exports = uploadMany;
