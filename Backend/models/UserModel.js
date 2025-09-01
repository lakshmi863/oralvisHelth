export default class UserModel {
  constructor(db) {
    this.db = db;
  }

  async createTable() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `);
  }

  async findByEmail(email) {
    return this.db.get("SELECT * FROM users WHERE email = ?", [email]);
  }

  // 🔑 renamed from insertUser → createUser
  async createUser(email, password, role) {
    return this.db.run(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, password, role]
    );
  }
}
