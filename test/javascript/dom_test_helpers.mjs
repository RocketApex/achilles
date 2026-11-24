export class TestElement {
  constructor({ id, dataset = {}, parentElement = null } = {}) {
    this.id = id || "";
    this.nodeType = 1;
    this.dataset = { ...dataset };
    this.attributes = {};
    this.parentElement = parentElement;

    if (this.id) {
      this.attributes.id = this.id;
    }
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);

    if (name === "data-component-registered") {
      this.dataset.componentRegistered = String(value);
    }
  }

  removeAttribute(name) {
    delete this.attributes[name];

    if (name === "data-component-registered") {
      delete this.dataset.componentRegistered;
    }
  }

  appendChild(child) {
    child.parentElement = this;
    return child;
  }

  contains(element) {
    let currentElement = element;

    while (currentElement) {
      if (currentElement === this) {
        return true;
      }

      currentElement = currentElement.parentElement;
    }

    return false;
  }

  querySelectorAll(selector) {
    return document.querySelectorAll(selector).filter((element) => element !== this && this.contains(element));
  }
}

export class TestDocument {
  constructor(elements = []) {
    this.elements = elements;
    this.listeners = new Map();
    this.documentElement = new TestElement({ id: "html" });
  }

  getElementById(id) {
    return this.elements.find((element) => element.id === id) || null;
  }

  querySelectorAll(selector) {
    if (selector === "[data-component-class]") {
      return this.elements.filter((element) => element.dataset.componentClass !== undefined);
    }

    if (selector === "[data-app-timezone]") {
      return this.elements.filter((element) => element.dataset.appTimezone !== undefined);
    }

    if (selector === "[id]") {
      return this.elements.filter((element) => element.id);
    }

    if (selector.startsWith("#")) {
      return this.elements.filter((element) => selector === `#${window.CSS.escape(element.id)}`);
    }

    return [];
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  addEventListener(eventName, callback) {
    const listeners = this.listeners.get(eventName) || [];
    listeners.push(callback);
    this.listeners.set(eventName, listeners);
  }

  removeEventListener(eventName, callback) {
    const listeners = this.listeners.get(eventName) || [];
    this.listeners.set(
      eventName,
      listeners.filter((listener) => listener !== callback)
    );
  }

  dispatchEvent(event) {
    const listeners = this.listeners.get(event.type) || [];
    listeners.forEach((callback) => callback(event));
  }
}

export const mutationObservers = [];

export function installDom(elements = []) {
  const document = new TestDocument(elements);
  mutationObservers.length = 0;

  globalThis.document = document;
  globalThis.Node = { TEXT_NODE: 3 };
  globalThis.window = {
    CSS: {
      escape: (value) => String(value).replaceAll(":", "\\:"),
    },
  };
  globalThis.MutationObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.observing = false;
      mutationObservers.push(this);
    }

    observe(target, config) {
      this.observing = true;
      this.config = config;
    }

    disconnect() {
      this.observing = false;
    }

    trigger(mutations = []) {
      this.callback(mutations, this);
    }
  };

  return document;
}
