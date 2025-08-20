class GameData {
  constructor({
    gameId,
    playCount = 0,
    totalScreenTime = 0,
    averageTimePlayed = 0,
    lastPlayed = null,
    // rating and totalReviews removed
    highScoreDetails = [],
    scoreDetails = [],
    averageScore = 0,
    lastUpdated = null,
  } = {}) {
    this.gameId = gameId;
    this.playCount = playCount;
    this.totalScreenTime = totalScreenTime;
    this.averageTimePlayed = averageTimePlayed;
    this.lastPlayed = lastPlayed;
    // rating and totalReviews removed
    this.highScoreDetails = highScoreDetails;
    this.scoreDetails = scoreDetails;
    this.averageScore = averageScore;
    this.lastUpdated = lastUpdated;
  }

  /**
   * Updates game play stats after each session.
   * @param {Object} params
   * @param {string} params.userId - User who played the game
   * @param {number} params.playTime - Duration played in seconds
   * @param {number} params.score - Score achieved in the session
   * @param {number} [params.rating] - Rating given by user (optional)
   * @param {string} [params.lastPlayedDate] - ISO timestamp of when played
   * @param {boolean} [params.isFavorite] - is the game favorite to the user
   */
  updatePlayStats({
    userId,
    playTime,
    score,
    rating = null,
    // reviewCount removed
    lastPlayedDate,
    isFavorite = false,
  }) {
    this.playCount += 1;
    this.totalScreenTime += playTime;
    this.averageTimePlayed = this.totalScreenTime / this.playCount;
    this.lastPlayed = lastPlayedDate || new Date().toISOString();

    // Update average score
    this.averageScore =
      (this.averageScore * (this.playCount - 1) + score) / this.playCount;

    // Always ensure only the highest score is stored
    if (
      this.highScoreDetails.length === 0 ||
      score > this.highScoreDetails[0]?.highScore
    ) {
      this.highScoreDetails = [
        {
          highScore: score,
          userId,
          timeStamp: new Date().toISOString(),
        },
      ];
    }

    // Prepare scoreDetails entry, include rating if present
    const scoreEntry = {
      userId,
      score,
      playTime,
      timeStamp: new Date().toISOString(),
    };

    if (typeof rating === "number" && !isNaN(rating)) {
      scoreEntry.rating = rating;
    }

    if (typeof isFavorite === "boolean") {
      scoreEntry.isFavorite = isFavorite;
    }

    this.scoreDetails.push(scoreEntry);

    this.lastUpdated = new Date().toISOString();
  }

  toFirestore() {
    // This will NOT include rating or totalReviews
    return { ...this };
  }
}

module.exports = GameData;
