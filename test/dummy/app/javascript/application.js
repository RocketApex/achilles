import "@hotwired/turbo-rails";
import { Application } from "achilles/application/application";
import {
  DemoCounterComponent,
  DemoFrameComponent,
  DemoFormComponent,
  DemoFormFieldComponent,
  DemoNestedButtonComponent,
  DemoPanelComponent,
} from "demo_counter_component";

const bootCount = Number(window.sessionStorage.getItem("achillesBootCount") || "0") + 1;
window.sessionStorage.setItem("achillesBootCount", String(bootCount));
window.achillesBootCount = bootCount;

const achilles = new Application();
achilles.componentsClassMapper.addComponentClass("DemoCounterComponent", DemoCounterComponent);
achilles.componentsClassMapper.addComponentClass("DemoFrameComponent", DemoFrameComponent);
achilles.componentsClassMapper.addComponentClass("DemoPanelComponent", DemoPanelComponent);
achilles.componentsClassMapper.addComponentClass("DemoNestedButtonComponent", DemoNestedButtonComponent);
achilles.componentsClassMapper.addComponentClass("DemoFormComponent", DemoFormComponent);
achilles.componentsClassMapper.addComponentClass("DemoFormFieldComponent", DemoFormFieldComponent);
achilles.start();

window.achilles = achilles;
