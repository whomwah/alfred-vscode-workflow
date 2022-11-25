import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { DB } from "../deps.ts";
import { Config } from "./helpers/config.ts";
import { queryArgs } from "./helpers/query.ts";
import Setting, { _internals } from "./setting.ts";

const config = {
  baseUrl: "https://github.com",
  baseApiUrl: "https://api.github.com",
  db: "" as unknown as DB,
} as Config;

Deno.test("Default", async (t) => {
  await t.step("it should valid settings", async () => {
    const query = ">";
    const items: Alfred.Item[] = [];
    const args = queryArgs(query, ">");
    await Setting(args, items, config);

    assertEquals(items.length, 5);

    assertEquals(items[0]?.title, "Delete database");
    assertEquals(items[0]?.autocomplete, "> delete database");
    assertEquals(items[0]?.arg, "###database_delete###");
    assertEquals(items[0]?.icon, { path: "./icons/delete.png" });

    assertEquals(items[1]?.title, "Resync");
    assertEquals(items[1]?.autocomplete, "> resync");
    assertEquals(items[1]?.icon, { path: "./icons/delete.png" });

    assertEquals(items[2]?.title, "Check");
    assertEquals(items[2]?.autocomplete, "> check");
    assertEquals(items[2]?.icon, { path: "./icons/refresh.png" });
    assertEquals(items[2]?.arg, "###update_available###");

    assertEquals(items[3]?.title, "Source folder");
    assertEquals(items[3]?.autocomplete, "> source");
    assertEquals(items[3]?.icon, { path: "./icons/book.png" });
    assertEquals(items[3]?.arg, "###workflow_open###");

    assertEquals(items[4]?.title, "Help");
    assertEquals(items[4]?.autocomplete, "> help");
    assertEquals(
      items[4]?.arg,
      "###url###https://github.com/whomwah/alfred-vscode-workflow/blob/main/README.md",
    );
    assertEquals(items[4]?.icon, { path: "./icons/help.png" });
  });

  await t.step(
    "it shouldn't show src if INIT_PATH hasn't changed",
    async () => {
      const originalInitFile = Deno.env.get("INIT_FILE");
      Deno.env.set("INIT_FILE", "mod.min.js");

      const query = ">";
      const items: Alfred.Item[] = [];
      const args = queryArgs(query, ">");
      await Setting(args, items, config);

      assertEquals(items.length, 4);

      assertEquals(items[0]?.title, "Delete database");
      assertEquals(items[0]?.autocomplete, "> delete database");
      assertEquals(items[0]?.arg, "###database_delete###");
      assertEquals(items[0]?.icon, { path: "./icons/delete.png" });

      assertEquals(items[1]?.title, "Resync");
      assertEquals(items[1]?.autocomplete, "> resync");
      assertEquals(items[1]?.icon, { path: "./icons/delete.png" });

      assertEquals(items[2]?.title, "Check");
      assertEquals(items[2]?.autocomplete, "> check");
      assertEquals(items[2]?.icon, { path: "./icons/refresh.png" });
      assertEquals(items[2]?.arg, "###update_available###");

      assertEquals(items[3]?.title, "Help");
      assertEquals(items[3]?.autocomplete, "> help");
      assertEquals(
        items[3]?.arg,
        "###url###https://github.com/whomwah/alfred-vscode-workflow/blob/main/README.md",
      );
      assertEquals(items[3]?.icon, { path: "./icons/help.png" });

      if (originalInitFile) {
        Deno.env.set("INIT_FILE", originalInitFile);
      } else {
        Deno.env.delete("INIT_FILE");
      }
    },
  );
});
