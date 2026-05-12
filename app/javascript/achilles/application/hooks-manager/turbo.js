class Turbo {
  _application;
  _setupCallback;
  _teardownCallback;
  _setupHandler;
  _teardownHandler;
  _started = false;

  constructor(application, setupCallback, teardownCallback) {
    this._application = application;
    this._setupCallback = setupCallback;
    this._teardownCallback = teardownCallback;
  }

  // Setups relevant hooks to the page for component lifecycles. This depends on the framework being used.
  // Here we are using turbo drive, so hooking into that.
  start() {
    if (this._started) {
      return;
    }

    this._setupHandler = () => {
      this._setupCallback();
    };

    this._teardownHandler = () => {
      this._teardownCallback();
    };

    document.addEventListener("turbo:load", this._setupHandler);
    document.addEventListener("turbo:before-render", this._teardownHandler);
    this._started = true;
  }

  stop() {
    if (!this._started) {
      return;
    }

    document.removeEventListener("turbo:load", this._setupHandler);
    document.removeEventListener("turbo:before-render", this._teardownHandler);
    this._setupHandler = null;
    this._teardownHandler = null;
    this._started = false;
  }
}

export { Turbo }
