import { AppConstants } from "achilles/application/app_constants";

// Parse the entire html dom and register components if not already registered
class ComponentParser {
    constructor(componentRegistry, componentsClassMapper) {
        this._componentRegistry = componentRegistry;
        this._componentsClassMapper = componentsClassMapper;
    }

    parse() {
        [...document.querySelectorAll('[data-component-class]')].forEach((elem) => {
            let klassName = elem.dataset.componentClass;
            if(klassName.trim() === '') { return; }
            if(!this.hasValidId(elem)) {
                console.error(`Component root element is missing an id. className: ${klassName} | Element:`, elem);
                return;
            }

            let klass = this._componentsClassMapper.getComponentClass(klassName);
            if(typeof klass === 'undefined' || klass === null) {
                console.error(`Component class not found: ${klassName} | Element:`);
                console.error(elem);
                return;
            }
            if(elem.dataset.componentRegistered === 'true' && this._componentRegistry.getRegisteredComponent(elem.id)) {
                return;
            }
            try {
                let obj = new klass(elem.id, this.parentComponentIdFor(elem))
                this._componentRegistry.registerComponentByObj(obj);
            } catch (e) {
                console.error(`Error parsing component. className: ${klassName} | Element ID: ${elem.id}`);
                console.error(elem);
                console.error(e);
            }
        })
    }

    hasValidId(elem) {
        return typeof elem.id === 'string' && elem.id.trim() !== '';
    }

    parentComponentIdFor(elem) {
        let parent = elem.parentElement;
        while(parent) {
            if(parent.dataset?.componentClass && this.hasValidId(parent)) {
                return parent.id;
            }
            parent = parent.parentElement;
        }

        return AppConstants.PageComponentId;
    }
}

export { ComponentParser };
