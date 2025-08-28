import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync("shiftapp.db");

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shiftId TEXT,
      latitude REAL,
      longitude REAL,
      timestamp TEXT
    );
  `);
};

export const saveOfflineLocation = async (
  shiftId: string,
  lat: number,
  lng: number,
  timestamp: number
) => {
  await db.runAsync(
    "INSERT INTO locations (shiftId, latitude, longitude, timestamp) VALUES (?, ?, ?, ?);",
    [shiftId, lat, lng, String(timestamp)]
  );
};

export const getOfflineLocations = async (): Promise<any[]> => {
  const result = await db.getAllAsync("SELECT * FROM locations;");
  return result;
};

export const deleteLocation = async (id: number) => {
  await db.runAsync("DELETE FROM locations WHERE id = ?;", [id]);
};
