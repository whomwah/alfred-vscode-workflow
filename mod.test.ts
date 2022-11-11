import {
  assertSpyCall,
  stub,
} from "https://deno.land/std@0.156.0/testing/mock.ts";
import { run } from "./mod.ts";

Deno.test("#run", async (t) => {
  await t.step("it takes the args and uses them", () => {
    const consoleStub = stub(console, "log");

    try {
      run(["/Users/fred/_dev/deno/app1", "/Users/fred/_dev/deno/app2"]);

      assertSpyCall(consoleStub, 0, {
        args: [
          '{"items":[{"title":"app1","subtitle":"/Users/fred/_dev/deno/app1","arg":"/Users/fred/_dev/deno/app1"},{"title":"app2","subtitle":"/Users/fred/_dev/deno/app2","arg":"/Users/fred/_dev/deno/app2"}]}',
        ],
      });
    } finally {
      consoleStub.restore();
    }
  });
});
