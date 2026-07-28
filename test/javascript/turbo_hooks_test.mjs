import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { installDom } from "./dom_test_helpers.mjs";

test("Turbo hooks call setup on turbo:load and teardown on turbo:before-render", async () => {
  const document = installDom();
  const { Turbo } = await importAchilles("application/hooks-manager/turbo.js");

  const calls = [];
  const application = {
    componentRegistry: {
      teardownAndDeregisterWithin() {},
    },
  };
  const turbo = new Turbo(application, () => calls.push("setup"), () => calls.push("teardown"));
  turbo.start();

  document.dispatchEvent({ type: "turbo:load" });
  document.dispatchEvent({ type: "turbo:before-render" });

  assert.deepEqual(calls, ["setup", "teardown"]);
});

test("Turbo frame cleanup runs inside the renderer and preserves its invocation", async () => {
  const document = installDom();
  const { Turbo } = await importAchilles("application/hooks-manager/turbo.js");

  const frame = { id: "account-frame" };
  const calls = [];
  const application = {
    componentRegistry: {
      teardownAndDeregisterWithin(element) {
        calls.push(["cleanup", element]);
      },
    },
  };
  const turbo = new Turbo(application, () => {}, () => {});
  turbo.start();

  const receiver = { id: "renderer-context" };
  const renderResult = { status: "rendered" };
  const detail = {
    render(...args) {
      calls.push(["render", this, args]);
      return renderResult;
    },
  };
  const originalRender = detail.render;

  document.dispatchEvent({
    type: "turbo:before-frame-render",
    target: frame,
    detail,
  });

  assert.notEqual(detail.render, originalRender);
  assert.deepEqual(calls, []);
  assert.equal(detail.render.call(receiver, "current", "incoming"), renderResult);
  assert.deepEqual(calls, [
    ["cleanup", frame],
    ["render", receiver, ["current", "incoming"]],
  ]);
});

test("Turbo frame renderer preserves thrown errors", async () => {
  const document = installDom();
  const { Turbo } = await importAchilles("application/hooks-manager/turbo.js");

  const error = new Error("render failed");
  const application = {
    componentRegistry: {
      teardownAndDeregisterWithin() {},
    },
  };
  const turbo = new Turbo(application, () => {}, () => {});
  turbo.start();

  let renderCount = 0;
  const detail = {
    render() {
      renderCount += 1;
      throw error;
    },
  };

  document.dispatchEvent({
    type: "turbo:before-frame-render",
    target: { id: "account-frame" },
    detail,
  });

  let thrownError;

  try {
    detail.render();
  } catch (caughtError) {
    thrownError = caughtError;
  }

  assert.equal(thrownError, error);
  assert.equal(renderCount, 1);
});
