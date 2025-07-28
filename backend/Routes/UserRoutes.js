const express = require("express");
const router = express.Router();

const {
  registerNewUser,
  logInUser,
} = require("../Controllers/UserController");

router.post("/register", registerNewUser);
router.post("/login", logInUser);

module.exports = router;
