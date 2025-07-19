const bcrypt = require("bcrypt");

const standadRole = "User";

class User {
  constructor({ userName, emailAddress, hashedPassword, role }) {
    this.userName = userName.toLowerCase().trim();
    this.emailAddress = emailAddress;
    this.password = hashedPassword;
    this.role = standadRole;
    this.dateCreated = new Date().toISOString();
  }

  static async create({ userName, emailAddress, password, role }) {
    if (typeof userName !== "string" || !userName.trim()) {
      throw new TypeError("Invalid User Name");
    }

    if (
      typeof emailAddress !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)
    ) {
      throw new TypeError("Invalid Email Address");
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (typeof password !== "string" || !passwordRegex.test(password)) {
      throw new TypeError(
        "Password must be at least 8 characters and include at least one number, one lowercase, and one uppercase letter"
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return new User({ userName, emailAddress, hashedPassword, role });
  }

  toFirestore() {
    return {
      userName: this.userName,
      emailAddress: this.emailAddress,
      password: this.password,
      role: this.role,
      dateCreated: this.dateCreated,
    };
  }
}

module.exports = User;
