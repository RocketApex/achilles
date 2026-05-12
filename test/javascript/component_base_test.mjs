import test from "node:test";
import assert from "node:assert/strict";

import { importAchilles } from "./module_loader.mjs";
import { TestElement, installDom } from "./dom_test_helpers.mjs";

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
