import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { TestElement, installDom } from "./dom_test_helpers.mjs";

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

test("ComponentParser assigns nearest component ancestor as parent", async () => {
  const dashboard = new TestElement({
    id: "dashboard",
    dataset: { componentClass: "DashboardComponent" },
  });
  const filters = new TestElement({
    id: "filters",
    dataset: { componentClass: "FiltersComponent" },
    parentElement: dashboard,
  });
  installDom([dashboard, filters]);

  const { ComponentBase } = await importAchilles("components/component_base.js");
  const { ComponentsClassMapper } = await importAchilles("components/components_class_mapper.js");
  const { ComponentParser } = await importAchilles("components/component_parser.js");
  const { ComponentsRegistry } = await importAchilles("components/components_registry.js");

  class DashboardComponent extends ComponentBase {}
  class FiltersComponent extends ComponentBase {}

  const registry = new ComponentsRegistry();
  registry.registerComponent("Page", { id: "Page" }, [], null);

  const mapper = new ComponentsClassMapper();
  mapper.addComponentClass("DashboardComponent", DashboardComponent);
  mapper.addComponentClass("FiltersComponent", FiltersComponent);

  new ComponentParser(registry, mapper).parse();

  assert.equal(registry.getRegisteredComponent("dashboard").parentComponentId, "Page");
  assert.equal(registry.getRegisteredComponent("filters").parentComponentId, "dashboard");
  assert.deepEqual(registry.getRegisteredComponent("Page").subComponents, ["dashboard"]);
  assert.deepEqual(registry.getRegisteredComponent("dashboard").subComponents, ["filters"]);
});
