const Game = require("../models/Game");
const { getFirestore } = require("firebase-admin/firestore");
const getDateTimeParts = require("../utils/DateTimeService");
const { fetchAllGames } = require("../Services/GameService");

const db = getFirestore();
const gamesCollection = db.collection("games");

const addNewGame = async (req, res) => {
  try {
    const { formattedId } = getDateTimeParts("G");

    // Adding gameId to the request body
    const game = new Game({ ...req.body, gameId: formattedId });

    // Using the gameId as the document ID
    await gamesCollection.doc(formattedId).set(game.toFirestore());

    return res
      .status(201)
      .json({ message: `Game with id: ${formattedId} Sucessfully Added` });
  } catch (err) {
    console.error("Game creation error:", err.message);
    return res.status(400).json({ error: err.message });
  }
};

const getGamesByStatus = async (req, res) => {
  try {
    // Query games where isActive == "true"
    const querySnapshot = await gamesCollection
      .where("isActive", "==", true)
      .get();

    // If no documents found
    if (querySnapshot.empty) {
      return res.status(400).json({ message: "No games to display" });
    }

    // Extract data
    const games = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ games });
  } catch (err) {
    console.error("Error fetching games:", err.message);
    return res.status(500).json({ error: err.message });
  }
};


const getGames = async (req, res) => {
  try {
    const games = await fetchAllGames();

    if (!games.length) {
      return res.status(400).json({ message: "No games to display" });
    }

    return res.status(200).json({ games });
  } catch (err) {
    console.error("Error fetching games:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }
    const docRef = gamesCollection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ mesaage: "Game Not Found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Error Fetching Data:", err.message);
    res.status(400).json({ error: err.message });
  }
};

const getGameByCategory = async (req, res) => {
  try {
    const { gameCategory } = req.params;
    if (!gameCategory) {
      return res
        .status(400)
        .json({ error: "gameCategory parameter is required" });
    }

    const snapshot = await gamesCollection
      .where("gameCategory", "array-contains", gameCategory)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No games found in this category" });
    }

    const games = [];
    snapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ games });
  } catch (err) {
    console.error("Error Fetching Data by Category:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const filterGames = async (req, res) => {
  try {
    const { gameDifficulty } = req.params;

    if (!gameDifficulty) {
      return res.status(400).json({ message: "Difficulty Level is Required." });
    }

    const snapshot = await gamesCollection
      .where("difficulty", "==", gameDifficulty)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ message: "No Games to Display for the Difficulty." });
    }

    const games = [];
    snapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json({ games });
  } catch (err) {
    console.error("Error Fetching Data:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getGamesByName = async (req, res) => {
  try {
    const { gameName } = req.params;

    if (!gameName) {
      return res.status(400).json({ message: "Game Name is Required" });
    }

    const snapshot = await gamesCollection
      .where("gameName", ">=", gameName)
      .where("gameName", "<=", gameName + "\uf8ff")
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No Games Found." });
    }

    const games = [];
    snapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ games });
  } catch (err) {
    console.error("Error Fetching Data:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const updateGames = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ message: "Game ID is required" });
    }

    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "Valid game data is required" });
    }

    // Optional: check if game exists before updating
    const gameSnapshot = await gamesCollection.doc(id).get();
    if (!gameSnapshot.exists) {
      return res.status(404).json({ message: "Game not found" });
    }

    const updatedGame = new Game({ ...data });

    await gamesCollection
      .doc(id)
      .set(updatedGame.toFirestore(), { merge: true });

    res.status(200).json({ message: "Game updated successfully", id });
  } catch (err) {
    console.error("Error updating game:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const docRef = gamesCollection.doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return res
        .status(404)
        .json({ message: "Game with given ID does not exist." });
    }

    await docRef.delete();

    res.status(200).json({ message: "Document deleted successfully." });
  } catch (err) {
    console.error("Error deleting game:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getGamesByRating = async (req, res) => {
  try {
    const docRef = gamesCollection.where("rating", ">=", 4.0);
    const docSnapshot = await docRef.get();

    if (docSnapshot.empty) {
      return res.status(404).json({ message: "No games Found" });
    }
    const games = [];
    docSnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ games });
  } catch (err) {
    console.error("Error Fetching Game:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
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
};
