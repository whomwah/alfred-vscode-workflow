import "./alfred.d.ts";
import Builder from "./helpers/builder.ts";
import { mapProjectToItem } from "./helpers/mapping.ts";
import { Config } from "./helpers/config.ts";
import { cacheFetchAll } from "./helpers/cache.ts";
import { updateAvailableItem } from "./helpers/updateAvailable.ts";
import { QueryArgs } from "./helpers/query.ts";

export default function Search(
  queryArgs: QueryArgs,
  listItems: Alfred.Item[],
  config: Config,
) {
  const items = listItems;
  const builder = Builder(queryArgs, items);
  const commands = async () => {
    return await Promise.all([
      updateAvailableItem(builder, config),
      results(),
    ]);
  };

  const results = async () => {
    const projects = await _internals.fetchProjects(config);

    return Promise.all([
      ...projects.map((project) => builder.addItem(mapProjectToItem(project))),
    ]);
  };

  return commands();
}

const fetchProjects = async (config: Config) => await cacheFetchAll(config);

export const _internals = { fetchProjects };
