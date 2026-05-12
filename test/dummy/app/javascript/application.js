import { Application } from "achilles/application/application";
import { DemoCounterComponent } from "demo_counter_component";

const achilles = new Application();
achilles.componentsClassMapper.addComponentClass("DemoCounterComponent", DemoCounterComponent);

window.achilles = achilles;
