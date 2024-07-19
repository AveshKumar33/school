const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const uploadMany = require("../middleware/staff-file-upload");
const checkUserRole = require("../middleware/checkUserType");

const {
  postEmployee,
  getEmployee,
  getAllEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  viewsFile,
} = require("../controller/employee-controller");

router.post("/", auth, checkUserRole(["admin"]), uploadMany, postEmployee);

router.get("/", auth, checkUserRole(["admin"]), getEmployee);

router.get("/all", auth, checkUserRole(["admin"]), getAllEmployee);

router.get(
  "/file/:filename",
  auth,
  checkUserRole(["admin", "teacher"]),
  viewsFile
);

router.get("/:id", auth, checkUserRole(["admin", "teacher"]), getEmployeeById);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin", "teacher"]),
  uploadMany,
  updateEmployee
);

router.delete("/:id", auth, checkUserRole(["admin"]), deleteEmployee);

module.exports = router;
