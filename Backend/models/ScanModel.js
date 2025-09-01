export default class ScanModel {
  constructor(db) {
    this.db = db;
  }

  async createTable() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS scans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT,
        patientId TEXT,
        scanType TEXT,
        region TEXT,
        imageUrl TEXT,
        uploadDate TEXT
      )
    `);
  }

  async insertScan(patientName, patientId, scanType, region, imageUrl, uploadDate) {
    return this.db.run(
      "INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate) VALUES (?, ?, ?, ?, ?, ?)",
      [patientName, patientId, scanType, region, imageUrl, uploadDate]
    );
  }

  async getAllScans() {
    return this.db.all("SELECT * FROM scans");
  }

  async getScanById(id) {
    return this.db.get("SELECT * FROM scans WHERE id = ?", [id]);
  }
}
