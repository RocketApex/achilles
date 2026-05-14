import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { TestElement, installDom } from "./dom_test_helpers.mjs";

test("ComponentsRegistry runs setup and teardown once for a component tree", async () => {
  const element = new TestElement({ id: "counter" });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const calls = [];

  class PageComponent extends ComponentBase {
    setup() {
      calls.push("page:setup");
    }

    teardown() {
      calls.push("page:teardown");
    }
  }

  class CounterComponent extends ComponentBase {
    setup(...params) {
      calls.push(`counter:setup:${params.join(",")}`);
    }

    teardown(...params) {
      calls.push(`counter:teardown:${params.join(",")}`);
    }
  }

  const registry = new ComponentsRegistry();
  registry.registerComponentByObj(new PageComponent("Page", null));
  registry.registerComponentByObj(new CounterComponent("counter", "Page", ["one"]));

  registry.callSetupForComponent("Page");
  registry.callSetupForComponent("Page");
  registry.callTeardownForComponent("Page");
  registry.callTeardownForComponent("Page");

  assert.deepEqual(calls, [
    "page:setup",
    "counter:setup:one",
    "counter:teardown:one",
    "page:teardown",
  ]);
});

test("ComponentsRegistry skips registration when parent component is missing", async () => {
  const element = new TestElement({ id: "counter" });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const registry = new ComponentsRegistry();
  const errors = [];

  const originalError = console.error;
  console.error = (...args) => errors.push(args);

  try {
    registry.registerComponentByObj(new ComponentBase("counter", "missing-parent"));
  } finally {
    console.error = originalError;
  }

  assert.equal(registry.getRegisteredComponent("counter"), undefined);
  assert.equal(element.dataset.componentRegistered, undefined);
  assert.match(String(errors[0][0]), /Parent component not found/);
});

test("ComponentsRegistry tears down and deregisters components whose element disappeared", async () => {
  const element = new TestElement({ id: "counter" });
  const document = installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  let teardownCount = 0;

  class CounterComponent extends ComponentBase {
    teardown() {
      teardownCount += 1;
    }
  }

  const registry = new ComponentsRegistry();
  registry.registerComponent("Page", { id: "Page" }, [], null);
  registry.registerComponentByObj(new CounterComponent("counter", "Page"));

  registry.callSetupForComponent("counter");
  document.elements = [];

  const originalError = console.error;
  console.error = () => {};
  registry.callSetupForComponent("counter");
  console.error = originalError;

  assert.equal(teardownCount, 1);
  assert.equal(registry.getRegisteredComponent("counter"), undefined);
  assert.equal(Object.hasOwn(registry._registeredComponents, "counter"), false);
});

test("ComponentsRegistry deregisters a component subtree", async () => {
  const panel = new TestElement({ id: "panel" });
  const nestedButton = new TestElement({ id: "nested-button", parentElement: panel });
  installDom([panel, nestedButton]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const registry = new ComponentsRegistry();
  registry.registerComponent("Page", { id: "Page" }, [], null);
  registry.registerComponentByObj(new ComponentBase("panel", "Page"));
  registry.registerComponentByObj(new ComponentBase("nested-button", "panel"));

  registry.deregisterComponent("panel");

  assert.equal(registry.getRegisteredComponent("panel"), undefined);
  assert.equal(registry.getRegisteredComponent("nested-button"), undefined);
  assert.deepEqual(registry.getRegisteredComponent("Page").subComponents, []);
  assert.equal(panel.dataset.componentRegistered, undefined);
  assert.equal(nestedButton.dataset.componentRegistered, undefined);
});

test("ComponentsRegistry deregisters a component subtree after teardown", async () => {
  const panel = new TestElement({ id: "panel" });
  const nestedButton = new TestElement({ id: "nested-button", parentElement: panel });
  installDom([panel, nestedButton]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const calls = [];

  class PanelComponent extends ComponentBase {
    teardown() {
      calls.push("panel:teardown");
    }
  }

  class NestedButtonComponent extends ComponentBase {
    teardown() {
      calls.push("nested-button:teardown");
    }
  }

  const registry = new ComponentsRegistry();
  registry.registerComponent("Page", { id: "Page" }, [], null);
  registry.registerComponentByObj(new PanelComponent("panel", "Page"));
  registry.registerComponentByObj(new NestedButtonComponent("nested-button", "panel"));

  registry.callSetupForComponent("Page");
  registry.teardownAndDeregister("panel");

  assert.deepEqual(calls, ["nested-button:teardown", "panel:teardown"]);
  assert.equal(registry.getRegisteredComponent("panel"), undefined);
  assert.equal(registry.getRegisteredComponent("nested-button"), undefined);
});

test("ComponentsRegistry can remount a reused component after teardown", async () => {
  const element = new TestElement({ id: "counter" });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const calls = [];

  class CounterComponent extends ComponentBase {
    setup() {
      calls.push("setup");
    }

    teardown() {
      calls.push("teardown");
    }
  }

  const registry = new ComponentsRegistry();
  const component = new CounterComponent("counter", null);
  registry.registerComponentByObj(component);

  registry.callSetupForComponent("counter");
  registry.callTeardownForComponent("counter");
  registry.callSetupForComponent("counter");

  assert.deepEqual(calls, ["setup", "teardown", "setup"]);
  assert.equal(component.mounted, true);
  assert.equal(component.setupExecuted, true);
  assert.equal(component.teardownExecuted, false);
});

test("ComponentsRegistry logs lifecycle errors by default", async () => {
  const element = new TestElement({ id: "counter" });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const error = new Error("setup failed");
  const errors = [];

  class CounterComponent extends ComponentBase {
    setup() {
      throw error;
    }
  }

  const registry = new ComponentsRegistry();
  registry.registerComponentByObj(new CounterComponent("counter", null));

  const originalError = console.error;
  console.error = (...args) => errors.push(args);

  try {
    assert.doesNotThrow(() => registry.callSetupForComponent("counter"));
  } finally {
    console.error = originalError;
  }

  assert.equal(errors[0][0], error);
});

test("ComponentsRegistry re-raises lifecycle errors in strict mode", async () => {
  const element = new TestElement({ id: "counter" });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  const error = new Error("setup failed");

  class CounterComponent extends ComponentBase {
    setup() {
      throw error;
    }
  }

  const registry = new ComponentsRegistry();
  registry.strictLifecycleErrors = true;
  registry.registerComponentByObj(new CounterComponent("counter", null));

  const originalError = console.error;
  console.error = () => {};

  try {
    assert.throws(() => registry.callSetupForComponent("counter"), error);
  } finally {
    console.error = originalError;
  }
});
