const express = require("express");
const router = express.Router();

const {
  registerNewUser,
  logInUser,
  forgotPassword,
  resetPassword
} = require("../Controllers/UserController");

router.post("/register", registerNewUser);
router.post("/login", logInUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token",resetPassword)

module.exports = router;
