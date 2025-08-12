const { fetchGamesDataWithNames } = require("../Services/GameDataServices");

const leaderBoardAllGames = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    const formattedData = data
      .filter(
        (game) =>
          game.gameName &&
          Array.isArray(game.scoreDetails) &&
          game.scoreDetails.length > 0
      )
      .map((game) => {
        const scoreDetails = game.scoreDetails[0];

        return {
          gameName: game.gameName,
          userId: scoreDetails.userId,
          userName: scoreDetails.userName,
          scoreAchieved: scoreDetails.score,
          dateAcheived: new Date(scoreDetails.timeStamp),
        };
      });
    const arrangedData = formattedData.sort((a, b) => {
      if (b.scoreAchieved === a.scoreAchieved) {
        return new Date(b.dateAcheived) - new Date(a.dateAcheived); // More recent date first
      }
      return b.scoreAchieved - a.scoreAchieved; // Higher score first
    });

    return res.status(200).json({ arrangedData });
  } catch (err) {
    return res.status(500).json({ message: "Error Fetching data" });
  }
};

const leaderBoardByGame = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    const formattedData = data
      .filter(
        (game) =>
          game.gameName &&
          Array.isArray(game.scoreDetails) &&
          game.scoreDetails.length > 0
      )
      .map((game) => ({
        gameName: game.gameName,
        scoreBoard: game.scoreDetails
          .sort((a, b) => b.score - a.score) // sort by score
          .slice(0, 10) // top 10
          .map(({ userId, userName, score, timeStamp }) => ({
            userId,
            userName,
            score,
            timeStamp,
          })),
      }));

    return res.status(200).json({ formattedData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error Fetching Data", error: err.message });
  }
};


const leaderBoardByUser = async (req, res) => {
  try {
    const data = await fetchGamesDataWithNames();
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Data Error" });
    }

    // Flatten all scores with game name included
    const leaderboard = data
      .filter((game) => game.gameName && Array.isArray(game.scoreDetails))
      .flatMap((game) =>
        game.scoreDetails.map((score) => ({
          gameName: game.gameName,
          userId: score.userId,
          userName: score.userName,
          achievedOn: score.timeStamp,
          score: score.score,
        }))
      )
      .sort(
        (a, b) =>
          b.score - a.score || new Date(b.achievedOn) - new Date(a.achievedOn)
      ) // Sort by score, then timestamp
      .slice(0, 10); // Optional: top 50

    const arrangedData = leaderboard;

    return res.status(200).json({ leaderboard });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching Data", err });
  }
};

module.exports = { leaderBoardAllGames, leaderBoardByGame, leaderBoardByUser };
