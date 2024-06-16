import { AppConstants } from "common/src/achilles/application/app_constants";

// Parse the entire html dom and register components if not already registered
class ComponentParser {
    constructor(componentRegistry, componentsClassMapper) {
        this._componentRegistry = componentRegistry;
        this._componentsClassMapper = componentsClassMapper;
    }

    parse() {
        [...$('*[data-component-class]')].forEach((elem) => {
            let klassName = $(elem).data('component-class');
            if(klassName.trim() === '') { return; }

            let klass = this._componentsClassMapper.getComponentClass(klassName);
            if(typeof klass === 'undefined' || klass === null) {
                console.error(`Component class not found: ${klassName} | Element:`);
                console.error($(elem));
                return;
            }
            if($(elem).data('component-registered') === true) {
                return;
            }
            try {
                let obj = new klass($(elem).attr('id'), AppConstants.PageComponentId)
                this._componentRegistry.registerComponentByObj(obj);
            } catch (e) {
                console.error(`Error parsing component. className: ${klassName} | Element ID: ${$(elem).attr('id')}`);
                console.error($(elem));
                console.error(e);
            }
        })
    }
}

export { ComponentParser };
