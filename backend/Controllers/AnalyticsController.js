const { fetchGamesDataWithNames } = require("../Services/GameDataServices");
const { calculateAverage } = require("../utils/Calculator");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();
const gamesCollection = db.collection("games");

const totalScreenTimeByGame = async (req, res) => {
  try {
    // fetching all the game data
    const data = await fetchGamesDataWithNames();

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    // filtering the gamedata by game name instead of id
    // this is because if the game is deleted from the database the game name becomes undefiend, filtering such games
    const filteredData = data
      .filter((game) => game.gameName)
      .map((game) => ({
        gameName: game.gameName,
        gameId: game.gameId,
        totalScreenTime: game.totalScreenTime,
      }));

    // sorting the filterd data in  decending order
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
        gameId: game.gameId,
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
        gameId: game.gameId,
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

    const scoreDiffs = data.map((game) => {
      const maxScore = Math.max(
        ...game.highScoreDetails.map((hs) => hs.highScore)
      );
      return {
        gameName: game.gameName,
        averageScore: game.averageScore,
        highScore: maxScore,
        difference: maxScore - game.averageScore,
      };
    });
    const arrangedData = scoreDiffs.sort((a, b) => a.difference - b.difference);
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
