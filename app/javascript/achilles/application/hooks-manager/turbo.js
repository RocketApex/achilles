class Turbo {
  _application;
  _setupCallback;
  _teardownCallback;
  _setupHandler;
  _teardownHandler;
  _frameRenderHandler;
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

    this._frameRenderHandler = (event) => {
      const frame = event.target;
      const originalRender = event.detail?.render;

      if (!frame || typeof originalRender !== "function") {
        return;
      }

      const componentRegistry = this._application.componentRegistry;
      event.detail.render = function(...args) {
        componentRegistry.teardownAndDeregisterWithin(frame);
        return Reflect.apply(originalRender, this, args);
      };
    };

    document.addEventListener("turbo:load", this._setupHandler);
    document.addEventListener("turbo:before-render", this._teardownHandler);
    document.addEventListener("turbo:before-frame-render", this._frameRenderHandler);
    this._started = true;
  }

  stop() {
    if (!this._started) {
      return;
    }

    document.removeEventListener("turbo:load", this._setupHandler);
    document.removeEventListener("turbo:before-render", this._teardownHandler);
    document.removeEventListener("turbo:before-frame-render", this._frameRenderHandler);
    this._setupHandler = null;
    this._teardownHandler = null;
    this._frameRenderHandler = null;
    this._started = false;
  }
}

export { Turbo }
