import Database from "better-sqlite3";

export const initDB = async () => {
  const db = new Database("./oralvis.db");
  return db;
};
