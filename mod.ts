import { createMd5Hash } from "./src/md5.ts";
import { fuzzyMatch } from "./src/utils.ts";

interface Item {
  uid: string;
  title: string;
  subtitle: string;
  arg: string;
  match: string;
}

export async function run(args: string[] = Deno.args) {
  const query = args[0];
  const hasQuery = query === "###";
  const filteredItems = (items: Item[]) =>
    items.filter((item) => fuzzyMatch(item.title, query));

  const items = await Promise.all(
    args.slice(hasQuery ? 1 : 2, args.length).map(async (arg: string) => {
      const parts = arg.split("/");
      const title = parts[parts.length - 1];
      const match = title.replaceAll("-", "");
      const md5 = await _internals.createMd5Hash(title);

      const item: Item = {
        uid: md5,
        match,
        title,
        subtitle: arg,
        arg,
      };

      return item;
    }),
  );

  console.log(
    JSON.stringify({
      items: hasQuery ? items : filteredItems(items),
    }),
  );
}

export const _internals = { createMd5Hash };

await run();
