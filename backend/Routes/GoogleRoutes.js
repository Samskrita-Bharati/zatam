const express = require("express");
const router = express.Router();
const { logInUsingGoogle } = require("../Controllers/GoogleController");

router.post("/google-login", logInUsingGoogle);

module.exports = router;
