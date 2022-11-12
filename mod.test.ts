import {
  assertSpyCall,
  resolvesNext,
  stub,
} from "https://deno.land/std@0.156.0/testing/mock.ts";
import { _internals, run } from "./mod.ts";

Deno.test("#run", async (t) => {
  await t.step("it shows everything when we have no query", async () => {
    const consoleStub = stub(console, "log");
    const md5Stub = stub(
      _internals,
      "createMd5Hash",
      resolvesNext(["uid1", "uid2"]),
    );

    try {
      await run([
        "###",
        "/Users/fred/_dev/deno/app1",
        "/Users/fred/_dev/deno/app2",
      ]);

      assertSpyCall(consoleStub, 0, {
        args: [
          '{"items":[{"uid":"uid1","match":"app1","title":"app1","subtitle":"/Users/fred/_dev/deno/app1","arg":"/Users/fred/_dev/deno/app1"},{"uid":"uid2","match":"app2","title":"app2","subtitle":"/Users/fred/_dev/deno/app2","arg":"/Users/fred/_dev/deno/app2"}]}',
        ],
      });
    } finally {
      consoleStub.restore();
      md5Stub.restore();
    }
  });

  await t.step("it takes the args and only shows matches", async () => {
    const consoleStub = stub(console, "log");
    const md5Stub = stub(
      _internals,
      "createMd5Hash",
      resolvesNext(["uid1", "uid2", "uid3"]),
    );

    try {
      await run([
        "app",
        "###",
        "/Users/fred/_dev/deno/app1",
        "/Users/fred/_dev/deno/app2",
        "/Users/fred/_dev/deno/ignore2",
      ]);

      assertSpyCall(consoleStub, 0, {
        args: [
          '{"items":[{"uid":"uid1","match":"app1","title":"app1","subtitle":"/Users/fred/_dev/deno/app1","arg":"/Users/fred/_dev/deno/app1"},{"uid":"uid2","match":"app2","title":"app2","subtitle":"/Users/fred/_dev/deno/app2","arg":"/Users/fred/_dev/deno/app2"}]}',
        ],
      });
    } finally {
      consoleStub.restore();
      md5Stub.restore();
    }
  });
});
