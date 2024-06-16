class Observer {
  _mutationObserver;
  _callback;

  constructor(callback) {
    this._callback = callback;
    this._mutationObserver = new MutationObserver(this.domChangedCallback.bind(this));
  }

  config() {
    return { attributes: false, childList: true, subtree: true };
  }

  start() {
    // Listen on html instead of body since turbo replaces body and the observer stops after one page transition
    this._mutationObserver.observe($('html')[0], this.config());
  }

  stop() {
    this._mutationObserver.disconnect();
  }

  domChangedCallback(mutationsList, observer) {
    this._callback();
  }
}

export { Observer }
