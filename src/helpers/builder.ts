import "../alfred.d.ts";
import { fuzzyMatch } from "./utils.ts";
import { createMd5Hash } from "./md5.ts";
import { QueryArgs } from "./query.ts";

export interface BuildItem {
  matchStr?: string;
  title: string;
  subtitle?: string | null;
  icon?: string;
  arg?: string;
  valid?: boolean;
  autocomplete?: string | boolean;
  skipUID?: boolean;
  skipMatch?: boolean;
}

export interface BuilderType {
  addItem: (item: BuildItem) => Promise<void>;
}

export default function Builder(queryArgs: QueryArgs, items: Alfred.Item[]) {
  const buildListItem = async (item: BuildItem): Promise<Alfred.Item> => {
    const icon = {
      path: item.icon ? `./icons/${item.icon}.png` : "./icon.png",
    };
    const arg = item.arg || queryArgs.query;
    const payload: Alfred.Item = {
      title: item.title,
      valid: item.valid === false ? false : true,
      icon,
      arg,
    };

    if (!item.skipUID) payload.uid = await createMd5Hash(item.title);
    if (item.subtitle) payload.subtitle = item.subtitle;

    if (item.autocomplete === false) {
      // do nothing
    } else if (typeof item.autocomplete == "string") {
      payload.autocomplete = item.autocomplete;
    } else {
      payload.autocomplete = item.matchStr || item.title;
    }

    return payload;
  };

  const addListItem = (item: Alfred.Item) => items.push(item);

  return {
    addItem: async (item: BuildItem) => {
      if (
        item.skipMatch ||
        matches(item.matchStr || item.title, queryArgs.query)
      ) {
        addListItem(await buildListItem(item));
      }
    },
  };
}

function matches(title: string, action: string) {
  return fuzzyMatch(title.toLowerCase(), action);
}
