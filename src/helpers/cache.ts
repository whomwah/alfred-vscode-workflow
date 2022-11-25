import { DB } from "../../deps.ts";
import { Config, storeConfig } from "./config.ts";
import { findd } from "./utils.ts";

/**
 * [:path, :title, :timestamp]
 */
export type DbCache = [string, string, number];

export interface Project {
  path: string;
  title: string;
  timestamp?: number;
}

export function deleteCache(db: DB) {
  try {
    db.query("DELETE FROM projects");
  } catch (err) {
    console.error(err);
  }
}

export function cacheItems(db: DB) {
  const items: Project[] = [];

  const query = db.prepareQuery<[Project["path"], Project["title"]]>(
    "SELECT path, title FROM projects",
  );

  for (const [path, title] of query.iter()) {
    items.push({ path, title });
  }
  query.finalize();

  return items;
}

export function updateCache(db: DB, list: string[], updated: string) {
  try {
    for (const path of list) {
      const parts = path.split("/");
      const title = parts[parts.length - 1];

      db.query(
        "INSERT INTO projects (path, title, timestamp) VALUES (?, ?, ?)",
        [
          path,
          title,
          updated,
        ],
      );
    }
  } catch (err) {
    console.error(err);
  }
}

export async function cacheFetchAll(config: Config): Promise<Project[]> {
  return await dbCacheFetch([], config);
}

async function dbCacheFetch<T>(
  results: Project[],
  config: Config,
): Promise<Project[]> {
  const initialCheck = config.cacheLastChecked === 0;
  const lastChecked = new Date(config.cacheLastChecked).getTime();

  // This is the initial check or the data looks stale
  if (initialCheck || lastChecked < config.invalidateCacheDate) {
    console.warn("We should fetch some new data! as this is OLD");
    deleteCache(config.db);

    const items = await findd(config.autoProjectSearchPath);
    const updatedAt = String(new Date().getTime());

    if (items.length > 0) {
      storeConfig(config.db, "cacheLastChecked", updatedAt);
      updateCache(config.db, items, updatedAt);
    }
  }

  results.push(...cacheItems(config.db));

  return Promise.resolve(results);
}
