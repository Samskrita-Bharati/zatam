const GameData = require("../models/GameData");
const { getFirestore } = require("firebase-admin/firestore");
const getDateTimeParts = require("../utils/DateTimeService");
const { fetchGamesDataWithNames } = require("../Services/GameDataServices");

const db = getFirestore();
const gamesDataCollection = db.collection("gamesdata");
const gamesCollection = db.collection("games");

const addData = async (req, res) => {
  try {
    const { gameId, userId, playTime, score, rating, review, isFavorite } =
      req.body;
    // validating required fields
    if (!gameId || !userId || playTime == null || score == null) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }
    //searching or the games collection to check if the game id exists

    const gameDoc = await gamesCollection.doc(gameId).get();

    if (!gameDoc.exists) {
      return res.status(404).json({ message: "Game Does Not Exist." });
    }

    //Searching for an existing gameData document for the given gameId
    const querySnapshot = await gamesDataCollection
      .where("gameId", "==", gameId)
      .limit(1)
      .get();

    let gameData;
    let docRef;

    if (!querySnapshot.empty) {
      //Updating existing document
      const doc = querySnapshot.docs[0];
      const existingData = doc.data();
      gameData = new GameData(existingData);
      gameData.updatePlayStats({
        playTime,
        score,
        rating,
        reviewCount: review || 0,
        lastPlayedDate: new Date().toISOString(),
        userId,
        isFavorite,
      });

      docRef = gamesDataCollection.doc(doc.id); // use existing doc ID
    } else {
      // Creating a new document with formatted ID
      const { formattedId } = getDateTimeParts("GD");

      gameData = new GameData({ gameId }); // include gameId as field
      gameData.updatePlayStats({
        playTime,
        score,
        rating,
        reviewCount: review || 0,
        lastPlayedDate: new Date().toISOString(),
        userId,
        isFavorite,
      });

      docRef = gamesDataCollection.doc(formattedId);
    }

    await docRef.set(gameData.toFirestore(), { merge: true });

    return res.status(200).json({ message: "Game data saved successfully" });
  } catch (err) {
    console.error("Game Data creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

//getting game data after adding userName and game Name for frontend purposes
const getGameData = async (req, res) => {
  try {
    const gamesData = await fetchGamesDataWithNames();

    if (!gamesData.length) {
      return res.status(404).json({ message: "No Game Data to Display" });
    }

    res.status(200).json({ gamesData });
  } catch (err) {
    console.error("Error fetching game data:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { addData, getGameData };
