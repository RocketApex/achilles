class Turbo {
  _application;
  _setupCallback;
  _teardownCallback;

  constructor(application, setupCallback, teardownCallback) {
    this._application = application;
    this._setupCallback = setupCallback;
    this._teardownCallback = teardownCallback;

    this.setupEvents();
  }

  // Setups relevant hooks to the page for component lifecycles. This depends on the framework being used.
  // Here we are using turbo drive, so hooking into that.
  setupEvents() {
    document.addEventListener("turbo:load", () => {
      this._setupCallback();
    });

    document.addEventListener("turbo:before-render", () => {
      this._teardownCallback();
    });
  }
}

export { Turbo }
