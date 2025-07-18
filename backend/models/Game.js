const { Timestamp } = require("firebase-admin/firestore");

class Game {
  constructor({
    gameName,
    gameCategory,
    gameImage,
    gameLink,
    developer,
    difficulty,
    rating,
    gameVersion,
    isActive = true,
  }) {
    if (typeof gameName !== "string" || !gameName.trim())
      throw new TypeError("Invalid gameName");
    if (!Array.isArray(gameCategory))
      throw new TypeError("gameCategory must be an array");
    if (typeof gameImage !== "string" || !gameImage.trim())
      throw new TypeError("Invalid gameImage");
    if (typeof gameLink !== "string" || !gameLink.trim())
      throw new TypeError("Invalid gameLink");
    if (typeof developer !== "string" || !developer.trim())
      throw new TypeError("Invalid developer");
    if (typeof difficulty !== "string" || !difficulty.trim())
      throw new TypeError("Invalid difficulty");
    if (typeof gameVersion !== "string" || !gameVersion.trim())
      throw new TypeError("Invalid gameVersion");
    if (typeof rating !== "number" || rating < 0 || rating > 5)
      throw new TypeError("Rating must be a number between 0 and 5");
    if (typeof isActive !== "boolean")
      throw new TypeError("isActive must be boolean");

    this.gameName = gameName.toLowerCase();
    this.gameCategory = gameCategory;
    this.gameImage = gameImage;
    this.gameLink = gameLink;
    this.developer = developer.toLowerCase();
    this.difficulty = difficulty;
    this.gameVersion = gameVersion;
    this.rating = rating;
    this.isActive = isActive;
    this.timeStamp = new Date().toISOString();
  }

  toFirestore() {
    return { ...this };
  }
}

module.exports = Game;
