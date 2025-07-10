const { getFirestore } = require("firebase-admin/firestore");

const { fetchAllGames } = require("./GameService");
const db = getFirestore();
const gamesDataCollection = db.collection("gamesdata");
const gamesCollection = db.collection("games");

const fetchGamesDataWithNames = async () => {
  try {
    const snapshot = await gamesDataCollection.get();
    const allGames = await fetchAllGames();

    const gameDataList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const gameIdToNameMap = {};
    allGames.forEach((game) => {
      gameIdToNameMap[game.gameId] = game.gameName;
    });

    return gameDataList.map((data) => ({
      ...data,
      gameName: gameIdToNameMap[data.gameId] || " Unknown Game",
    }));
  } catch (err) {
    console.log("Error Fetching Game Data:", err);
  }
};

module.exports = {fetchGamesDataWithNames}
