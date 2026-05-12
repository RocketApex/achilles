import { ComponentBase } from "achilles/components/component_base";

class DemoCounterComponent extends ComponentBase {
  setup() {
    this.count = 0;
    this.rootElement().addEventListener("click", this.increment);
  }

  teardown() {
    this.rootElement().removeEventListener("click", this.increment);
  }

  increment = () => {
    this.count += 1;
    this.rootElement().querySelector("[data-count]").textContent = this.count;
  }
}

export { DemoCounterComponent };
