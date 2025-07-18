const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const Game = require("./models/Game");

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");

const serviceAccount = require("./firestore/zat-am-b7997-bcf191dfbde8.json");

process.env.GOOGLE_APPLICATION_CREDENTIALS; // use this to load Firebase admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const gameRoutes = require("./Routes/GameRoutes");
const gameDataRoutes = require("./Routes/GameDataRoutes");
const analyticsRoutes = require("./Routes/AnalyticsRoutes");
const leaderBoardRoutes = require("./Routes/LeaderBoardRoutes");
const userRoutes = require("./Routes/UserRoutes")
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use("/api/games", gameRoutes);
app.use("/api/gamesData", gameDataRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leaderBoard", leaderBoardRoutes);
app.use('/api/users',userRoutes)

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
