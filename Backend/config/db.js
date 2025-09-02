import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function initDB() {
  const db = await open({
    filename: "./database.sqlite", // will be created if not exists
    driver: sqlite3.Database,
  });

  return db;
}
