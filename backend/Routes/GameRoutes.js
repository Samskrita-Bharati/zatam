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
  updateIsActiveStatus,
} = require("../Controllers/GameController");

router.post("/addNew", addNewGame);
router.post("/deleteGame/:id", deleteGame);

router.put("/gameUpdate/:id", updateGames);
router.put("/toggle-status/:id", updateIsActiveStatus);

router.get("/", getGames);
router.get("/byStatus", getGamesByStatus);
router.get("/get/:id", getGameById);
router.get("/getCatg/:gameCategory", getGameByCategory);
router.get("/filter/:gameDifficulty", filterGames);
router.get("/getName/:gameName", getGamesByName);
router.get("/rating", getGamesByRating);

module.exports = router;
