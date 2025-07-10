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
    rating,
    reviewCount = 0,
    lastPlayedDate,
  }) {
    this.playCount += 1;
    this.totalScreenTime += playTime;
    this.averageTimePlayed = this.totalScreenTime / this.playCount;
    this.lastPlayed = lastPlayedDate || new Date().toISOString();

    // Update average score
    this.averageScore =
      (this.averageScore * (this.playCount - 1) + score) / this.playCount;

    // Update average rating
    if (rating !== null && reviewCount > 0) {
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

    // Append to all score sessions

    this.scoreDetails.push({
      userId,
      score,
      playTime,
      rating,
      timeStamp: new Date().toISOString(),
    });

    this.lastUpdated = new Date().toISOString();
  }

  toFirestore() {
    return { ...this };
  }
}

module.exports = GameData;
