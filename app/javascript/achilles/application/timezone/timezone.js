class Timezone {
  _timezoneString;

  constructor() {
    this.getTimezoneFromHtml();
  }

  // Getters
  get timezoneString() {
    return this._timezoneString;
  }

  getTimezoneFromHtml() {
    this._timezoneString = $("div[data-app-timezone]").data("app-timezone") || "Etc/UTC";
  }
}

export { Timezone }
