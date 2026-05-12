import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { TestElement, installDom, mutationObservers } from "./dom_test_helpers.mjs";

test("ComponentParser registers mapped component classes from data-component-class", async () => {
  const element = new TestElement({
    id: "counter",
    dataset: { componentClass: "CounterComponent" },
  });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsClassMapper } = await importAchilles("components/components_class_mapper.js");
  const { ComponentParser } = await importAchilles("components/component_parser.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  class CounterComponent extends ComponentBase {}

  const registry = new ComponentsRegistry();
  registry.registerComponent("Page", { id: "Page" }, [], null);

  const mapper = new ComponentsClassMapper();
  mapper.addComponentClass("CounterComponent", CounterComponent);

  new ComponentParser(registry, mapper).parse();

  const registered = registry.getRegisteredComponent("counter");
  assert.ok(registered);
  assert.equal(registered.obj.constructor, CounterComponent);
  assert.equal(registered.parentComponentId, "Page");
  assert.equal(element.dataset.componentRegistered, "true");
});

test("ComponentParser skips component roots without ids", async () => {
  const element = new TestElement({
    dataset: { componentClass: "CounterComponent" },
  });
  installDom([element]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsClassMapper } = await importAchilles("components/components_class_mapper.js");
  const { ComponentParser } = await importAchilles("components/component_parser.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  let constructorCallCount = 0;
  const errors = [];

  class CounterComponent extends ComponentBase {
    constructor(...args) {
      constructorCallCount += 1;
      super(...args);
    }
  }

  const registry = new ComponentsRegistry();
  registry.registerComponent("Page", { id: "Page" }, [], null);

  const mapper = new ComponentsClassMapper();
  mapper.addComponentClass("CounterComponent", CounterComponent);

  const originalError = console.error;
  console.error = (...args) => errors.push(args);

  try {
    new ComponentParser(registry, mapper).parse();
  } finally {
    console.error = originalError;
  }

  assert.equal(constructorCallCount, 0);
  assert.equal(registry.getRegisteredComponent(""), undefined);
  assert.equal(element.dataset.componentRegistered, undefined);
  assert.match(String(errors[0][0]), /Component root element is missing an id/);
  assert.equal(errors[0][1], element);
});

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
    "page:teardown",
    "counter:teardown:one",
  ]);
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

  document.elements = [];

  const originalError = console.error;
  console.error = () => {};
  registry.callSetupForComponent("counter");
  console.error = originalError;

  assert.equal(teardownCount, 1);
  assert.equal(registry.getRegisteredComponent("counter"), null);
});

test("Application registers dynamically inserted components through the mutation observer", async () => {
  const document = installDom();

  const { Application } = await importAchilles("application/application.js");
  const { ComponentBase } = await importAchilles("components/component_base.js");

  let setupCount = 0;

  class DynamicComponent extends ComponentBase {
    setup() {
      setupCount += 1;
    }
  }

  const application = new Application();
  application.componentsClassMapper.addComponentClass("DynamicComponent", DynamicComponent);

  application.start();
  assert.equal(setupCount, 0);
  assert.equal(mutationObservers.length, 1);
  assert.equal(mutationObservers[0].observing, true);

  const element = new TestElement({
    id: "dynamic",
    dataset: { componentClass: "DynamicComponent" },
  });
  document.elements.push(element);

  mutationObservers[0].trigger([{ type: "childList" }]);

  assert.equal(setupCount, 1);
  assert.ok(application.componentRegistry.getRegisteredComponent("dynamic"));
  assert.equal(element.dataset.componentRegistered, "true");
});

test("Application start runs initial setup after synchronous component registration", async () => {
  const element = new TestElement({
    id: "initial",
    dataset: { componentClass: "InitialComponent" },
  });
  installDom([element]);

  const { Application } = await importAchilles("application/application.js");
  const { ComponentBase } = await importAchilles("components/component_base.js");

  let setupCount = 0;

  class InitialComponent extends ComponentBase {
    setup() {
      setupCount += 1;
    }
  }

  const application = new Application();
  application.componentsClassMapper.addComponentClass("InitialComponent", InitialComponent);

  application.start();

  assert.equal(setupCount, 1);
  assert.ok(application.componentRegistry.getRegisteredComponent("initial"));
  assert.equal(element.dataset.componentRegistered, "true");
});

test("Application waits for start before mounting components", async () => {
  const element = new TestElement({
    id: "manual",
    dataset: { componentClass: "ManualComponent" },
  });
  installDom([element]);

  const { Application } = await importAchilles("application/application.js");
  const { ComponentBase } = await importAchilles("components/component_base.js");

  let setupCount = 0;

  class ManualComponent extends ComponentBase {
    setup() {
      setupCount += 1;
    }
  }

  const application = new Application();
  application.componentsClassMapper.addComponentClass("ManualComponent", ManualComponent);

  await new Promise((resolve) => queueMicrotask(resolve));

  assert.equal(setupCount, 0);
  assert.equal(application.componentRegistry.getRegisteredComponent("manual"), undefined);

  application.start();

  assert.equal(setupCount, 1);
  assert.ok(application.componentRegistry.getRegisteredComponent("manual"));
  assert.equal(element.dataset.componentRegistered, "true");
});

test("Application start and stop manage Turbo hooks and mutation observer", async () => {
  const document = installDom();

  const { Application } = await importAchilles("application/application.js");

  const application = new Application();

  assert.equal(document.listeners.get("turbo:load")?.length || 0, 0);
  assert.equal(document.listeners.get("turbo:before-render")?.length || 0, 0);
  assert.equal(mutationObservers.length, 1);
  assert.equal(mutationObservers[0].observing, false);

  application.start();

  assert.equal(document.listeners.get("turbo:load")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-render")?.length, 1);
  assert.equal(mutationObservers[0].observing, true);

  application.start();

  assert.equal(document.listeners.get("turbo:load")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-render")?.length, 1);

  application.stop();

  assert.equal(document.listeners.get("turbo:load")?.length || 0, 0);
  assert.equal(document.listeners.get("turbo:before-render")?.length || 0, 0);
  assert.equal(mutationObservers[0].observing, false);
});

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

test("ComponentBase exposes DOM root through rootElement and rootNode", async () => {
  const element = new TestElement({ id: "counter:one" });
  installDom([element]);

  globalThis.window.$ = (selector) => {
    throw new Error(`rootElement should not call jQuery for ${selector}`);
  };

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const component = new ComponentBase("counter:one");

  assert.equal(component.rootNode(), element);
  assert.equal(component.rootElement(), element);
  assert.equal(component.rootElementSelector(), "#counter\\:one");
});
