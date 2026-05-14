import { AppConstants } from "achilles/application/app_constants";
import { ComponentsRegistry } from "achilles/components/components_registry";
import { ComponentParser } from "achilles/components/component_parser";
import { ComponentsClassMapper } from "achilles/components/components_class_mapper";
import { Page } from "achilles/page/page";
import { Timezone } from "achilles/application/timezone/timezone";
import { Turbo } from "achilles/application/hooks-manager/turbo";
import { Observer } from "achilles/application/dom-mutation-observer/observer";

// Application class/obj to drive all things for the web app
class Application {
  _page;
  _engine;
  _componentRegistry;
  _timezone;
  _componentsClassMapper;
  _hooksManager;
  _domMutationObserver;
  _started = false;

  constructor() {
    // Set the application while creating the object
    this._page = new Page(AppConstants.PageComponentId, null);
    this._componentRegistry = new ComponentsRegistry();
    this._componentsClassMapper = new ComponentsClassMapper();
    this._timezone = new Timezone();
    this._domMutationObserver = new Observer(this.setup.bind(this));

    // Register the first-level special component: Page
    this.componentRegistry.registerComponentByObj(this._page);

    // Hook into the window events
    this._hooksManager = new Turbo(this, this.setup.bind(this), this.teardown.bind(this));
  }

  // Getters
  get componentsClassMapper() {
    return this._componentsClassMapper;
  }

  get timezone() {
    return this._timezone;
  }

  get componentRegistry() {
    return this._componentRegistry;
  }

  get engine() {
    return this._engine;
  }

  get page() {
    return this._page;
  }

  get strictLifecycleErrors() {
    return this.componentRegistry.strictLifecycleErrors;
  }

  // Setters
  set engine(engine) {
    this._engine = engine;
  }

  set strictLifecycleErrors(value) {
    this.componentRegistry.strictLifecycleErrors = value;
  }

  start() {
    if (this._started) {
      return;
    }

    this._started = true;
    this._hooksManager.start();
    this.setup();
  }

  stop() {
    if (!this._started) {
      return;
    }

    this._started = false;
    this._hooksManager.stop();
    this.teardown();
    this._domMutationObserver.stop();
  }

  setup() {
    if (!this._started) {
      return;
    }

    this._domMutationObserver.stop();
    this.parseHtmlAndRegisterComponents();
    this.componentRegistry.callSetupForComponent(AppConstants.PageComponentId);
    this._domMutationObserver.start();
  }

  teardown() {
    this._domMutationObserver.stop();
    // Call Page and its subcomponents beforeRenders
    this.componentRegistry.callTeardownForComponent(AppConstants.PageComponentId);
    // Remove/deregister all components from page except Page
    this.deregisterAllComponentsExceptPage();

    if (this._started) {
      this._domMutationObserver.start();
    }
  }

  parseHtmlAndRegisterComponents() {
    const componentParser = new ComponentParser(this._componentRegistry, this._componentsClassMapper);
    componentParser.parse();
  }

  deregisterAllComponentsExceptPage() {
    let pageComponent = this.componentRegistry.getRegisteredComponent(AppConstants.PageComponentId);
    [...pageComponent.subComponents].forEach((subComponentId) => {
      this.componentRegistry.deregisterComponent(subComponentId);
    })
  }
}

export { Application };
