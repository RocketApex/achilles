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
    this._timezoneString = document.querySelector("[data-app-timezone]")?.dataset.appTimezone || "Etc/UTC";
  }
}

export { Timezone }
