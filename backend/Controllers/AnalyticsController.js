const { fetchGamesDataWithNames } = require("../Services/GameDataServices");
const { calculateAverage } = require("../utils/Calculator");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const gamesCollection = db.collection("games");

const totalScreenTimeByGame = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    const filteredData = data
      .filter((game) => game.gameName && game.totalScreenTime)
      .map((game) => ({
        gameName: game.gameName,
        totalScreenTime: game.totalScreenTime,
      }));

    const arrangedData = filteredData.sort(
      (a, b) => b.totalScreenTime - a.totalScreenTime
    );

    return res.status(200).json({ arrangedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error Fetching Total Screen Time By Game", err });
  }
};

const gameTimesPlayed = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }
    const filteredData = data
      .filter((game) => game.gameName && game.playCount)
      .map((game) => ({
        gameName: game.gameName,
        timesPlayed: game.playCount,
      }));

    const arrangedData = filteredData.sort(
      (a, b) => b.timesPlayed - a.timesPlayed
    );

    return res.status(200).json({ arrangedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error Fetching Game Times Played", err });
  }
};

const totalReviews = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    const filteredData = await Promise.all(
      data
        .filter((game) => game.gameName)
        .map(async (game) => {
          const userRatings = (game.scoreDetails || [])
            .map((userRating) => userRating.rating)
            .filter((rating) => typeof rating === "number");

          const { averageRating, ratingCount } = calculateAverage(userRatings);
          const roundedAverageRating = Math.round(averageRating * 2) / 2;

          const docRef = gamesCollection.doc(game.gameId);
          const docSnap = await docRef.get();
          if (!docSnap.exists) {
            console.warn(`Game ${game.gameId} not found in Database`);
          } else {
            const currentRating = docSnap.data().rating;

            if (currentRating !== roundedAverageRating) {
              await docRef.update({
                rating: roundedAverageRating,
              });
              console.log(`Updated Rating for ${game.gameName}`);
            }
          }

          return {
            gameName: game.gameName,
            gameId: game.gameId,
            averageRating: roundedAverageRating,
            totalRatings: ratingCount,
          };
        })
    );

    const arrangedData = filteredData.sort(
      (a, b) => b.averageRating - a.averageRating
    );
    return res.status(200).json({ arrangedData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error Fetching data", err });
  }
};

const gameLastPlayed = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    const filteredData = data
      .filter((game) => game.gameName && game.lastPlayed)
      .map((game) => ({
        gameName: game.gameName,
        lastPlayedDate: new Date(game.lastPlayed),
      }));

    const arrangedData = filteredData.sort(
      (a, b) => b.lastPlayedDate - a.lastPlayedDate
    );

    return res.status(200).json({ arrangedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error Fetching Game Times Played", err });
  }
};

const gameScoreAnalysis = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: " Data Error" });
    }

    const formattedData = data
      .filter(
        (game) =>
          game.gameName &&
          Array.isArray(game.highScoreDetails) &&
          game.highScoreDetails.length > 0
      )
      .map((game) => {
        const topScore = game.highScoreDetails[0]; // assuming highest score is first
        return {
          gameName: game.gameName,
          gameHighScore: topScore.highScore,
          achievedDate: new Date(topScore.timeStamp),
        };
      });
    const arrangedData = formattedData.sort(
      (a, b) => b.gameHighScore - a.gameHighScore
    );

    return res.status(200).json({ arrangedData });
  } catch (err) {
    return res.status(500).json({ message: "Error Fetching Data:", err });
  }
};

module.exports = {
  totalScreenTimeByGame,
  gameTimesPlayed,
  totalReviews,
  gameLastPlayed,
  gameScoreAnalysis,
};
