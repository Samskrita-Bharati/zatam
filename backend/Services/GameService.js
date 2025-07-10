const { getFirestore } = require("firebase-admin/firestore");
const db = getFirestore();
const gamesCollection = db.collection("games");

const fetchAllGames = async () => {
  const snapshot = await gamesCollection.get();
  return snapshot.docs.map((doc) => ({
    gameId: doc.id,
    ...doc.data(),
  }));
};

module.exports = { fetchAllGames };
