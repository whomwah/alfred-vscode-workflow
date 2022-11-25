import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import {
  resolvesNext,
  stub,
} from "https://deno.land/std@0.166.0/testing/mock.ts";
import { DB } from "../deps.ts";
import { Project } from "./helpers/cache.ts";
import { Config } from "./helpers/config.ts";
import { queryArgs } from "./helpers/query.ts";
import Search, { _internals } from "./search.ts";

const config = {
  baseUrl: "https://github.com",
  baseApiUrl: "https://api.github.com",
  db: "" as unknown as DB,
} as Config;

Deno.test("Default", async (t) => {
  await t.step("it should show partial results", async () => {
    const project1 = {
      path: "/path/to/my/example-project",
      title: "example-project",
      timestamp: 123456,
    } as Project;

    const project2 = {
      path: "/path/to/my/example",
      title: "example",
      timestamp: 123456,
    } as Project;

    const project3 = {
      path: "/path/to/my/duncan",
      title: "duncan",
      timestamp: 123456,
    } as Project;

    const prodFetch = stub(
      _internals,
      "fetchProjects",
      resolvesNext([[project1, project2, project3]]),
    );

    try {
      const query = "exam";
      const items: Alfred.Item[] = [];
      const args = queryArgs(query);
      await Search(args, items, config);

      assertEquals(items.length, 2);

      assertEquals(items[0].title, "example-project");
      assertEquals(items[0].subtitle, "/path/to/my/example-project");
      assertEquals(items[0].arg, "###project###/path/to/my/example-project");
      assertEquals(items[0].icon, { path: "./icons/projects.png" });

      assertEquals(items[1].title, "example");
      assertEquals(items[1].subtitle, "/path/to/my/example");
      assertEquals(items[1].arg, "###project###/path/to/my/example");
      assertEquals(items[1].icon, { path: "./icons/projects.png" });
    } finally {
      prodFetch.restore();
    }
  });

  await t.step("it should show full results", async () => {
    const project1 = {
      path: "/path/to/my/example-project",
      title: "example-project",
      timestamp: 123456,
    } as Project;

    const project2 = {
      path: "/path/to/my/example",
      title: "example",
      timestamp: 123456,
    } as Project;

    const project3 = {
      path: "/path/to/my/duncan",
      title: "duncan",
      timestamp: 123456,
    } as Project;

    const prodFetch = stub(
      _internals,
      "fetchProjects",
      resolvesNext([[project1, project2, project3]]),
    );

    try {
      const query = "";
      const items: Alfred.Item[] = [];
      const args = queryArgs(query);
      await Search(args, items, config);

      assertEquals(items.length, 3);

      assertEquals(items[0].title, "example-project");
      assertEquals(items[0].subtitle, "/path/to/my/example-project");
      assertEquals(items[0].arg, "###project###/path/to/my/example-project");
      assertEquals(items[0].icon, { path: "./icons/projects.png" });

      assertEquals(items[1].title, "example");
      assertEquals(items[1].subtitle, "/path/to/my/example");
      assertEquals(items[1].arg, "###project###/path/to/my/example");
      assertEquals(items[1].icon, { path: "./icons/projects.png" });

      assertEquals(items[2].title, "duncan");
      assertEquals(items[2].subtitle, "/path/to/my/duncan");
      assertEquals(items[2].arg, "###project###/path/to/my/duncan");
      assertEquals(items[2].icon, { path: "./icons/projects.png" });
    } finally {
      prodFetch.restore();
    }
  });
});
