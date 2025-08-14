const express = require("express");
const router = express.Router();

const { getNumberOfUsersByQuarter } = require("../Controllers/UserController")


router.get("/users-quarterly", getNumberOfUsersByQuarter);

module.exports = router;
