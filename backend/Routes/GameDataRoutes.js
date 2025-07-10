const express = require("express");
const router = express.Router();

const { addData,getGameData } = require("../Controllers/GameDataController");

router.post("/addNew", addData);
router.get("/",getGameData)
module.exports = router;
