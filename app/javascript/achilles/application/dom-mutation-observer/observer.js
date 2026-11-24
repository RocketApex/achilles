class Observer {
  _mutationObserver;
  _callback;
  _callbackScheduled = false;

  constructor(callback) {
    this._callback = callback;
    this._mutationObserver = new MutationObserver(this.domChangedCallback.bind(this));
  }

  config() {
    return {
      attributes: true,
      attributeFilter: ["id", "data-component-class"],
      childList: true,
      subtree: true,
    };
  }

  start() {
    // Listen on html instead of body since turbo replaces body and the observer stops after one page transition
    this._mutationObserver.observe(document.documentElement, this.config());
  }

  stop() {
    this._mutationObserver.disconnect();
    this._callbackScheduled = false;
  }

  domChangedCallback(mutationsList) {
    if (this._callbackScheduled || !mutationsList.some((mutation) => {
      // Replacing text cannot add or remove component roots.
      return mutation.type !== "childList" ||
        Array.from(mutation.addedNodes).some((node) => node.nodeType !== Node.TEXT_NODE) ||
        Array.from(mutation.removedNodes).some((node) => node.nodeType !== Node.TEXT_NODE);
    })) {
      return;
    }

    this._callbackScheduled = true;
    queueMicrotask(() => {
      this._callbackScheduled = false;
      this._callback();
    });
  }
}

export { Observer }
