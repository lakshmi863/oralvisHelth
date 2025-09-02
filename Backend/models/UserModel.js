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

  async createUser(email, password, role = "Dentist") {
    const result = await this.db.run(
      `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
      [email, password, role]
    );
    return { id: result.lastID, email, role };
  }

  async getUserByEmail(email) {
    return await this.db.get(`SELECT * FROM users WHERE email = ?`, [email]);
  }

  async getAllUsers() {
    return await this.db.all(`SELECT * FROM users`);
  }
}
