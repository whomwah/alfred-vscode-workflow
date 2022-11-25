import "./alfred.d.ts";
import Builder, { BuildItem } from "./helpers/builder.ts";
import { Config } from "./helpers/config.ts";
import { cacheItems } from "./helpers/cache.ts";
import { hasCustomSrcPath } from "./helpers/url.ts";
import { updateAvailableItem } from "./helpers/updateAvailable.ts";
import { QueryArgs } from "./helpers/query.ts";

export default function Setting(
  queryArgs: QueryArgs,
  listItems: Alfred.Item[],
  config: Config,
) {
  const items = listItems;
  const builder = Builder(queryArgs, items);
  const prefix = queryArgs.prefix;

  const commands = async () => {
    await Promise.all([
      updateAvailableItem(builder, config),
      results(),
      hasCustomSrcPath() ? builder.addItem(openSrcItem) : null,
    ]);

    return fallback();
  };

  const fallback = () => builder.addItem(helpItem);

  const helpItem: BuildItem = {
    matchStr: `${prefix} help`,
    title: "Help",
    subtitle: "View the README",
    arg:
      `###url###${config.baseUrl}/whomwah/alfred-vscode-workflow/blob/main/README.md`,
    icon: "help",
    skipUID: true,
    skipMatch: true,
  };

  const openSrcItem: BuildItem = {
    matchStr: `${prefix} source`,
    title: "Source folder",
    subtitle: "Open workflow src folder",
    arg: "###workflow_open###",
    icon: "book",
  };

  const results = () => {
    const cmds: BuildItem[] = [
      {
        matchStr: `${prefix} delete database`,
        title: "Delete database",
        subtitle: "Delete ALL data (project cache and settings)",
        arg: "###database_delete###",
        icon: "delete",
      },
      {
        matchStr: `${prefix} resync`,
        title: "Resync",
        subtitle: "Clear all projects and resync",
        icon: "delete",
        arg: "###refresh_cache###",
      },
      {
        matchStr: `${prefix} check`,
        title: "Check",
        subtitle: "Check for an update to the workflow",
        arg: `###update_available###`,
        icon: "refresh",
      },
    ];

    return Promise.all(cmds.map((cmd) => builder.addItem(cmd)));
  };

  return commands();
}

const fetchCacheItems = (config: Config) => cacheItems(config.db);

export const _internals = { fetchCacheItems };
