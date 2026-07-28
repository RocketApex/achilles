import { ComponentBase } from "achilles/components/component_base";

function recordTeardown(component) {
  window.achillesTeardownLog = window.achillesTeardownLog || [];
  window.achillesTeardownLog.push({
    id: component.id,
    connected: component.rootElement()?.isConnected === true,
  });
}

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

class DemoFrameComponent extends ComponentBase {
  setup() {
    this.rootElement().dataset.frameReady = "true";
  }

  teardown() {
    recordTeardown(this);
    this.rootElement()?.removeAttribute("data-frame-ready");
  }
}

class DemoPanelComponent extends ComponentBase {
  setup() {
    this.rootElement().dataset.panelReady = "true";
  }

  teardown() {
    recordTeardown(this);
    this.rootElement()?.removeAttribute("data-panel-ready");
  }
}

class DemoNestedButtonComponent extends ComponentBase {
  setup() {
    this.count = 0;
    this.rootElement().addEventListener("click", this.increment);
    this.rootElement().dataset.nestedButtonReady = "true";
  }

  teardown() {
    recordTeardown(this);
    this.rootElement()?.removeEventListener("click", this.increment);
  }

  increment = () => {
    this.count += 1;
    this.rootElement().querySelector("[data-nested-count]").textContent = this.count;
  }
}

class DemoFormComponent extends ComponentBase {
  setup() {
    this.rootElement().dataset.formReady = "true";
  }

  teardown() {
    this.rootElement()?.removeAttribute("data-form-ready");
  }
}

class DemoFormFieldComponent extends ComponentBase {
  setup() {
    this.input = this.rootElement().querySelector("[data-label-input]");
    this.preview = this.rootElement().querySelector("[data-label-preview]");
    this.input.addEventListener("input", this.updatePreview);
    this.updatePreview();
  }

  teardown() {
    this.input?.removeEventListener("input", this.updatePreview);
  }

  updatePreview = () => {
    this.preview.textContent = this.input.value || "empty";
  }
}

export {
  DemoCounterComponent,
  DemoFrameComponent,
  DemoFormComponent,
  DemoFormFieldComponent,
  DemoNestedButtonComponent,
  DemoPanelComponent,
};
