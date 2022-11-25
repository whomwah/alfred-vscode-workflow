import { DB, emptyDir, ensureDir } from "../deps.ts";
import { Config, prefetchConfig } from "./helpers/config.ts";
import { DATABASE, DB_DIR } from "../env.ts";

type InitCallback = (config: Config) => void;

export async function dbConnect() {
  try {
    await ensureDir(DB_DIR);
    await Deno.stat(DATABASE);

    return new DB(DATABASE);
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return createDB(new DB(DATABASE));
    }
    throw err;
  }
}

export function init(db: DB, initCallback: InitCallback) {
  return new Promise((resolve) => {
    const config = prefetchConfig(db);
    resolve(initCallback({ ...config, ...{ db } }));
  });
}

function createDB(db: DB) {
  db.query(`
    CREATE TABLE IF NOT EXISTS config(
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    ) WITHOUT ROWID
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS projects(
      path TEXT PRIMARY KEY NOT NULL,
      title TEXT,
      timestamp INTEGER NOT NULL
    ) WITHOUT ROWID
  `);

  return db;
}

export async function deleteDatabase(db: DB) {
  try {
    db.close();
    await emptyDir(DB_DIR);
  } catch (err) {
    console.error(err);
  }
}
