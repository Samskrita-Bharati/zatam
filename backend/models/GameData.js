class GameData {
  constructor({
    gameId,
    playCount = 0,
    totalScreenTime = 0,
    averageTimePlayed = 0,
    lastPlayed = null,
    rating = 0,
    totalReviews = 0,
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
    this.rating = rating;
    this.totalReviews = totalReviews;
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
   * @param {number} params.rating - Rating given by user
   * @param {number} params.reviewCount - How many reviews were added (0 or 1 typically)
   * @param {string} params.lastPlayedDate - ISO timestamp of when played
   */
  updatePlayStats({
    userId,
    playTime,
    score,
    rating = null,
    reviewCount = 0,
    lastPlayedDate,
    isFavorite,
  }) {
    this.playCount += 1;
    this.totalScreenTime += playTime;
    this.averageTimePlayed = this.totalScreenTime / this.playCount;
    this.lastPlayed = lastPlayedDate || new Date().toISOString();

    // Update average score
    this.averageScore =
      (this.averageScore * (this.playCount - 1) + score) / this.playCount;

    // Update average rating
    if (rating !== null && reviewCount > 0 && typeof rating === "number") {
      this.rating =
        (this.rating * this.totalReviews + rating) /
        (this.totalReviews + reviewCount);
      this.totalReviews += reviewCount;
    }

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

    // Conditionally pushing only relevant fields into scoreDetails
    const scoreEntry = {
      userId,
      score,
      playTime,
      timeStamp: new Date().toISOString(),
    };

    if (typeof rating === "number" && !isNaN(rating)) {
      scoreEntry.rating = rating;
    }

    if (typeof isFavorite === "true") {
      scoreEntry.isFavorite = isFavorite;
      // this.isFavorite = isFavorite; // Optionally track global user preference
    }
    // Append to all score sessions

    this.scoreDetails.push(scoreEntry);

    this.lastUpdated = new Date().toISOString();
  }

  toFirestore() {
    return { ...this };
  }
}

module.exports = GameData;
