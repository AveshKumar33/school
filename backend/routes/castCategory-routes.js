const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");

const castCategoryController = require("../controller/castCategoryController");

router.post(
  "/",
  auth,
  checkUserRole(["admin"]),
  castCategoryController.postCategory
);

router.get("/", auth, castCategoryController.getCategory);

router.get("/all", auth, castCategoryController.getAllCategory);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  castCategoryController.updateCategory
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  castCategoryController.deleteCategory
);

module.exports = router;
