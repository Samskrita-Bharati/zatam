const express = require("express");
const router = express.Router();

const {
  leaderBoardAllGames,
  leaderBoardByGame,
  leaderBoardByUser,
} = require("../Controllers/LeaderBoardController");

router.get("/allgames", leaderBoardAllGames);
router.get("/game", leaderBoardByGame);
router.get("/by-user", leaderBoardByUser);

module.exports = router;
