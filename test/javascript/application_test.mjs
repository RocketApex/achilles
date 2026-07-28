import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { TestElement, installDom, mutationObservers } from "./dom_test_helpers.mjs";

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
  mutationObservers[0].trigger([{ type: "childList" }]);

  assert.equal(setupCount, 0);

  await new Promise((resolve) => queueMicrotask(resolve));

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
  assert.equal(document.listeners.get("turbo:before-frame-render")?.length || 0, 0);
  assert.equal(mutationObservers.length, 1);
  assert.equal(mutationObservers[0].observing, false);

  application.start();

  assert.equal(document.listeners.get("turbo:load")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-render")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-frame-render")?.length, 1);
  assert.equal(mutationObservers[0].observing, true);

  application.start();

  assert.equal(document.listeners.get("turbo:load")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-render")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-frame-render")?.length, 1);

  application.stop();

  assert.equal(document.listeners.get("turbo:load")?.length || 0, 0);
  assert.equal(document.listeners.get("turbo:before-render")?.length || 0, 0);
  assert.equal(document.listeners.get("turbo:before-frame-render")?.length || 0, 0);
  assert.equal(mutationObservers[0].observing, false);

  application.start();

  assert.equal(document.listeners.get("turbo:load")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-render")?.length, 1);
  assert.equal(document.listeners.get("turbo:before-frame-render")?.length, 1);

  application.stop();

  assert.equal(document.listeners.get("turbo:load")?.length || 0, 0);
  assert.equal(document.listeners.get("turbo:before-render")?.length || 0, 0);
  assert.equal(document.listeners.get("turbo:before-frame-render")?.length || 0, 0);
});

test("Application cleans outgoing frame components before rendering and registers incoming components", async () => {
  const frame = new TestElement({ id: "account-frame" });
  const outgoing = new TestElement({
    id: "outgoing",
    dataset: { componentClass: "FrameComponent" },
    parentElement: frame,
  });
  const document = installDom([frame, outgoing]);

  const { Application } = await importAchilles("application/application.js");
  const { ComponentBase } = await importAchilles("components/component_base.js");

  const calls = [];

  class FrameComponent extends ComponentBase {
    setup() {
      calls.push(`${this.id}:setup`);
    }

    teardown() {
      calls.push(`${this.id}:teardown`);
    }
  }

  const application = new Application();
  application.componentsClassMapper.addComponentClass("FrameComponent", FrameComponent);
  application.start();

  const incoming = new TestElement({
    id: "incoming",
    dataset: { componentClass: "FrameComponent" },
    parentElement: frame,
  });
  const detail = {
    render() {
      assert.equal(application.componentRegistry.getRegisteredComponent("outgoing"), undefined);
      calls.push("render");
      document.elements = [frame, incoming];
      mutationObservers[0].trigger([{ type: "childList" }]);
    },
  };
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => errors.push(args);

  try {
    document.dispatchEvent({
      type: "turbo:before-frame-render",
      target: frame,
      detail,
    });
    detail.render();
    await new Promise((resolve) => queueMicrotask(resolve));
  } finally {
    console.error = originalError;
  }

  assert.deepEqual(calls, [
    "outgoing:setup",
    "outgoing:teardown",
    "render",
    "incoming:setup",
  ]);
  assert.ok(application.componentRegistry.getRegisteredComponent("incoming"));
  assert.equal(
    errors.some(([message]) => String(message).includes("Cannot find element while setup")),
    false
  );
});

test("Application preserves MutationObserver cleanup for ordinary DOM removals", async () => {
  const element = new TestElement({
    id: "removable",
    dataset: { componentClass: "RemovableComponent" },
  });
  const document = installDom([element]);

  const { Application } = await importAchilles("application/application.js");
  const { ComponentBase } = await importAchilles("components/component_base.js");

  let teardownCount = 0;

  class RemovableComponent extends ComponentBase {
    teardown() {
      teardownCount += 1;
    }
  }

  const application = new Application();
  application.componentsClassMapper.addComponentClass("RemovableComponent", RemovableComponent);
  application.start();

  document.elements = [];
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => errors.push(args);

  try {
    mutationObservers[0].trigger([{ type: "childList" }]);
    await new Promise((resolve) => queueMicrotask(resolve));
  } finally {
    console.error = originalError;
  }

  assert.equal(teardownCount, 1);
  assert.equal(application.componentRegistry.getRegisteredComponent("removable"), undefined);
  assert.equal(
    errors.some(([message]) => String(message).includes("Cannot find element while setup")),
    true
  );
});

test("Application exposes strict lifecycle error mode", async () => {
  installDom();

  const { Application } = await importAchilles("application/application.js");

  const application = new Application();

  assert.equal(application.strictLifecycleErrors, false);

  application.strictLifecycleErrors = true;

  assert.equal(application.strictLifecycleErrors, true);
  assert.equal(application.componentRegistry.strictLifecycleErrors, true);
});
