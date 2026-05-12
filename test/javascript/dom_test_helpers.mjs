export class TestElement {
  constructor({ id, dataset = {} } = {}) {
    this.id = id || "";
    this.dataset = { ...dataset };
    this.attributes = {};

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

    observe() {
      this.observing = true;
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
