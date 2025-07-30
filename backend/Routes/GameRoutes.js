const express = require("express");
const router = express.Router();
const {
  addNewGame,
  getGames,
  getGamesByStatus,
  getGameById,
  getGameByCategory,
  filterGames,
  getGamesByName,
  updateGames,
  deleteGame,
  getGamesByRating,
} = require("../Controllers/GameController");

router.post("/addNew", addNewGame);
router.get("/", getGames);
router.get("/byStatus", getGamesByStatus);
router.get("/get/:id", getGameById);
router.get("/getCatg/:gameCategory", getGameByCategory);
router.get("/filter/:gameDifficulty", filterGames);
router.get("/getName/:gameName", getGamesByName);
router.put("/gameUpdate/:id", updateGames);
router.post("/deleteGame/:id", deleteGame);
router.get("/rating", getGamesByRating);

module.exports = router;
