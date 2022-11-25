import { deleteCache } from "./helpers/cache.ts";
import { removeConfig } from "./helpers/config.ts";
import { dbConnect, deleteDatabase } from "./setup.ts";
import { openPath, openUrlInBrowser } from "./helpers/url.ts";
import { log } from "./helpers/log.ts";
import { dirname } from "../deps.ts";

export default async function Action(query: string) {
  // In this case its up to the function being passed the
  // DB to close the connect when finished.
  const db = await dbConnect();
  const action = (name: string) => query.startsWith(name);

  switch (true) {
    // We want to open the project in VSCode
    case action("###project###"): {
      log(query);
      break;
    }
    // We want to delete the database
    case action("###database_delete###"): {
      await deleteDatabase(db);
      log("Database deleted successfully!");
      break;
    }
    // We want to clear a specific cache
    case action("###refresh_cache###"): {
      removeConfig(db, "cacheLastChecked");
      deleteCache(db);
      db.close();
      log(`Cache cleared! It will resync next search.`);
      break;
    }
    // Attempt to download latest version
    case action("###update_available###"): {
      removeConfig(db, "latestVersion");
      removeConfig(db, "latestVersionLastChecked");
      db.close();
      log(query);
      break;
    }
    // Attempt to download latest version
    case action("###url###"): {
      const url = query.replace("###url###", "");
      await openUrlInBrowser(url);
      break;
    }
    // We want to open the workflow path
    case action("###workflow_open###"): {
      const srcPath = Deno.env.get("INIT_FILE");
      if (srcPath) openPath(dirname(srcPath));
      break;
    }
    default:
      log(query);
  }
}
