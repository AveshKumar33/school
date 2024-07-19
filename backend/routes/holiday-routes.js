const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const checkUserRole = require("../middleware/checkUserType");
const holidayController = require("../controller/HolidayController");

router.post("/", auth, checkUserRole(["admin"]), holidayController.postHoliday);

router.get("/", auth, checkUserRole(["admin"]), holidayController.getHoliday);

router.get("/all", holidayController.getAllHoliday);

router.put(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  holidayController.updateHoliday
);

router.delete(
  "/:id",
  auth,
  checkUserRole(["admin"]),
  holidayController.deleteHoliday
);

module.exports = router;
