import { DB } from "../../deps.ts";
import {
  cacheUpdateFrequency,
  TWENTY_FOUR_HOURS,
  updateFrequency,
} from "./frequency.ts";

export interface Config {
  db: DB;
  // Github
  baseUrl: string;
  baseApiUrl: string;
  // Workflow updates
  checkForUpdates: boolean;
  updateFrequency: number;
  currentVersion: string;
  latestVersion: string;
  latestVersionLastChecked: number;
  // Project settings
  cacheLastChecked: number;
  invalidateCacheDate: number;
  autoProjectSearchPath: string;
}

export function prefetchConfig(db: DB) {
  const config: Config = {
    db,
    baseUrl: "https://github.com",
    baseApiUrl: "https://api.github.com",
    checkForUpdates: !!parseInt(Deno.env.get("checkForUpdates") || "1"),
    updateFrequency: updateFrequency(),
    currentVersion: Deno.env.get("alfred_workflow_version") || "",
    latestVersion: "",
    latestVersionLastChecked: 0,
    cacheLastChecked: 0,
    invalidateCacheDate: new Date().getTime() -
      TWENTY_FOUR_HOURS * cacheUpdateFrequency(),
    autoProjectSearchPath: Deno.env.get("autoProjectSearchPath") || "",
  };

  for (const [key, value] of db.query("SELECT key, value FROM config")) {
    if (key === "cacheLastChecked") {
      config.cacheLastChecked = parseInt(value as string);
    }
    if (key === "latestVersionLastChecked") {
      config.latestVersionLastChecked = parseInt(value as string);
    }
    if (key === "latestVersion") config.latestVersion = value as string;
  }

  return config;
}

export function removeConfig(db: DB, key: string) {
  try {
    db.query("DELETE FROM config WHERE key = :key", { key });
  } catch (err) {
    console.error(err);
  }
}

export function storeConfig(db: DB, key: string, val: string) {
  try {
    db.query("REPLACE INTO config VALUES(:key, :value)", { key, value: val });
  } catch (err) {
    console.error(err);
  }
}
