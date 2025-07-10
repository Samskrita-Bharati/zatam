const express = require("express");
const router = express.Router();

const {
  totalScreenTimeByGame,
  gameTimesPlayed,
  totalReviews,
  gameLastPlayed,
  gameScoreAnalysis,
} = require("../Controllers/AnalyticsController");

router.get("/totlScreenTime", totalScreenTimeByGame);
router.get("/gameTimesPlayed", gameTimesPlayed);
router.get("/totalReviews", totalReviews);
router.get("/lastPlayed", gameLastPlayed);
router.get("/scoreAnalysis", gameScoreAnalysis);

module.exports = router;
