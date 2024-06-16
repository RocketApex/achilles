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
    // Events registering
    // Turbolinks lifecycle ref: https://sevos.io/2017/02/27/turbolinks-lifecycle-explained.html
    // Render is not called on initial page load. So execute only once during page load
    $(document).one("turbo:load", () => {
      this._setupCallback();
    });

    // Render is called before each page transition. But its not called on initial page load. That's why we need 'load'
    $(document).on("turbo:render", () => {
      this._setupCallback();
    });

    $(document).on("turbo:before-render", () => {
      this._teardownCallback();
    });
  }
}

export { Turbo }
