const express = require("express");
const router = express.Router();

const {
  registerNewUser,
  logInUser,
  checkUserNameAvailability,
} = require("../Controllers/UserController");

router.post("/register", registerNewUser);
router.get("/chk-userName/:userName", checkUserNameAvailability);
router.post("/login", logInUser);

module.exports = router;
