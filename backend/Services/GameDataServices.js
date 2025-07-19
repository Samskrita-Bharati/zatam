const { getFirestore } = require("firebase-admin/firestore");

const { fetchAllGames } = require("./GameService");
const db = getFirestore();
const gamesDataCollection = db.collection("gamesdata");
const gamesCollection = db.collection("games");

const userCollection = db.collection("users")

const fetchGamesDataWithNames = async () => {
  try {
    // Fetch game data and game name map
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

    // Step 1: Gather all unique userIds
    const allUserIds = new Set();
    gameDataList.forEach((gameData) => {
      gameData.highScoreDetails?.forEach((entry) =>
        allUserIds.add(entry.userId)
      );
      gameData.scoreDetails?.forEach((entry) => allUserIds.add(entry.userId));
    });

    // Step 2: Fetch userName for each userId
    const userIdToNameMap = {};
    const userFetches = [];

    for (let userId of allUserIds) {
      const query = userCollection.where("userId", "==", userId).limit(1).get();
      userFetches.push(query);
    }

    const userSnapshots = await Promise.all(userFetches);
    userSnapshots.forEach((snap) => {
      if (!snap.empty) {
        const doc = snap.docs[0];
        const user = doc.data();
        userIdToNameMap[user.userId] = user.userName;
      }
    });

    // Step 3: Enrich game data with userNames
    const enrichedGameData = gameDataList.map((data) => ({
      ...data,
      gameName: gameIdToNameMap[data.gameId] || "Unknown Game",
      highScoreDetails:
        data.highScoreDetails?.map((entry) => ({
          ...entry,
          userName: userIdToNameMap[entry.userId] || "Unknown User",
        })) || [],
      scoreDetails:
        data.scoreDetails?.map((entry) => ({
          ...entry,
          userName: userIdToNameMap[entry.userId] || "Unknown User",
        })) || [],
    }));

    return enrichedGameData;
  } catch (err) {
    console.log("Error Fetching Game Data:", err);
    return [];
  }
};

module.exports = {fetchGamesDataWithNames}
