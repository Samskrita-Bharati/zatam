const express = require("express");
const router = express.Router();

const { getNumberOfUsersByQuarter } = require("../Controllers/UserController");
const { getNumberofGamesByQuarter } = require("../Controllers/GameController");

router.get("/users-quaterly", getNumberOfUsersByQuarter);
router.get("/games-quaterly", getNumberofGamesByQuarter);

module.exports = router;
