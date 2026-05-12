import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { installDom } from "./dom_test_helpers.mjs";

test("Turbo hooks call setup on turbo:load and teardown on turbo:before-render", async () => {
  const document = installDom();
  const { Turbo } = await importAchilles("application/hooks-manager/turbo.js");

  const calls = [];
  const turbo = new Turbo({}, () => calls.push("setup"), () => calls.push("teardown"));
  turbo.start();

  document.dispatchEvent({ type: "turbo:load" });
  document.dispatchEvent({ type: "turbo:before-render" });

  assert.deepEqual(calls, ["setup", "teardown"]);
});
