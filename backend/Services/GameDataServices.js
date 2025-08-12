const { getFirestore } = require("firebase-admin/firestore");

const { fetchAllGames } = require("./GameService");
const db = getFirestore();
const gamesDataCollection = db.collection("gamesdata");
const gamesCollection = db.collection("games");

const userCollection = db.collection("users");

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
      // Try fetching by document ID first
      const docRef = userCollection.doc(userId).get();
      userFetches.push(
        docRef.then((docSnap) => {
          if (docSnap.exists) {
            const user = docSnap.data();
            userIdToNameMap[userId] = user.userName || "Unnamed User";
          } else {
            // If no doc found by ID, try by field "userId"
            return userCollection
              .where("userId", "==", userId)
              .limit(1)
              .get()
              .then((querySnap) => {
                if (!querySnap.empty) {
                  const doc = querySnap.docs[0];
                  const user = doc.data();
                  userIdToNameMap[userId] = user.userName || "Unnamed User";
                } else {
                  console.warn(
                    `⚠ No matching user found for userId: ${userId}`
                  );
                  userIdToNameMap[userId] = "Unknown User";
                }
              });
          }
        })
      );
    }

    await Promise.all(userFetches);

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
    console.error("Error Fetching Game Data:", err);
    return [];
  }
};


module.exports = { fetchGamesDataWithNames };
