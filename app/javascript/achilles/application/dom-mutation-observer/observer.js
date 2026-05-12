class Observer {
  _mutationObserver;
  _callback;
  _callbackScheduled = false;

  constructor(callback) {
    this._callback = callback;
    this._mutationObserver = new MutationObserver(this.domChangedCallback.bind(this));
  }

  config() {
    return { attributes: false, childList: true, subtree: true };
  }

  start() {
    // Listen on html instead of body since turbo replaces body and the observer stops after one page transition
    this._mutationObserver.observe(document.documentElement, this.config());
  }

  stop() {
    this._mutationObserver.disconnect();
    this._callbackScheduled = false;
  }

  domChangedCallback(mutationsList, observer) {
    if (this._callbackScheduled) {
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
