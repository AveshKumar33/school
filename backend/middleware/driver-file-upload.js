const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    switch (file.fieldname) {
      case "photo":
        callback(null, path.join(__dirname, "../upload/Driver/photo"));
        break;
      case "aadharCard":
        callback(null, path.join(__dirname, "../upload/Driver/aadhar"));
        break;
      case "licence":
        callback(null, path.join(__dirname, "../upload/Driver/licence"));
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
  { name: "aadharCard", maxCount: 1 },
  { name: "photo", maxCount: 1 },
  { name: "licence", maxCount: 1 },
]);
module.exports = uploadMany;
