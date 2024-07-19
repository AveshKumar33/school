const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const studentCategoryController = require("../controller/studentCategoryController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  studentCategoryController.postCategory
);

router.get("/", auth, studentCategoryController.getCategory);

router.get("/all", auth, studentCategoryController.getAllCategory);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  studentCategoryController.updateCategory
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  studentCategoryController.deleteCategory
);

module.exports = router;
