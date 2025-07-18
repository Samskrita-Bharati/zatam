const express = require("express");
const router = express.Router();

const { registerNewUser } = require("../Controllers/UserController");

router.post("/register", registerNewUser);

module.exports = router;
