import { AppConstants } from "achilles/application/app_constants";

// Contains all the registered components in a page at the current moment
class ComponentsRegistry {
    _registeredComponents = {};

    matchingElementsForId(id) {
        return [...document.querySelectorAll('[id]')].filter((elem) => elem.id === id);
    }

    elementForId(id) {
        return document.getElementById(id);
    }

    registerComponentByObj(obj) {
        this.registerComponent(obj.id, obj, obj.defaultParams, obj.parentComponentId);
    }

    registerComponent(id, obj, defaultParams, parentComponentId) {
        if(this.matchingElementsForId(id).length > 1) {
            console.error(`Error while registering component: There are more than one elements with the same id: ${id}. Skipping registering component`);
            return;
        }
        if(this._registeredComponents[id]) {
            // Component is already registered. So have to call deregister and teardown
            this.teardownAndDeregister(id);
        }

        this._registeredComponents[id] = {
            id: id,
            obj: obj,
            defaultParams: defaultParams,
            parentComponentId: parentComponentId,
            subComponents: []
        };
        if(parentComponentId != null) {
            let parentComponent = this.getRegisteredComponent(parentComponentId);
            parentComponent.subComponents.push(id);
        }
        this.elementForId(id)?.setAttribute('data-component-registered', 'true');
    }

    deregisterComponent(id) {
        let component = this._registeredComponents[id];
        if(!component)
            return;

        let parentComponent = this.getRegisteredComponent(component.parentComponentId);

        if(parentComponent != null){
            parentComponent.subComponents = parentComponent.subComponents.filter(item => item !== id);
        }

        delete this._registeredComponents[id];
        this.elementForId(id)?.removeAttribute('data-component-registered');
    }

    getRegisteredComponent(id) {
        return this._registeredComponents[id];
    }

    callSetupForComponent(id) {
        let component = this.getRegisteredComponent(id);
        if(!component || !component.obj)
            return;
        if(id !== AppConstants.PageComponentId && this.elementForId(id) === null) {
            this.elementNotFound(id);
            return;
        }

        // Call the objs default setup if it is not mounted already, then continue to children
        if(component.obj.setup && component.obj.mounted === false) {
            try{
                component.obj.setup(...component.defaultParams);
                component.obj.mounted = true;
            } catch(e) {
                console.error(e);
            }
        }

        // Call setup for all subcomponents
        component.subComponents.forEach((subComponentId) => {
            this.callSetupForComponent(subComponentId);
        });
    }

    callTeardownForComponent(id) {
        let component = this.getRegisteredComponent(id);
        if(!component || !component.obj)
            return;

        // Call teardown for all sub view_components before their parent
        component.subComponents.forEach((subComponentId) => {
            this.callTeardownForComponent(subComponentId);
        });

        // Call the objs default teardown if it is currently mounted
        if(component.obj.teardown && component.obj.mounted === true) {
            try{
                component.obj.teardown(...component.defaultParams);
                component.obj.mounted = false;
            } catch(e) {
                console.error(e);
            }
        }
    }

    teardownAndDeregister(id) {
        this.callTeardownForComponent(id);
        this.deregisterComponent(id);
    }

    elementNotFound(id) {
        console.error('Cannot find element while setup, so teardown & deregister. id: ' + id);
        this.teardownAndDeregister(id);
    }
}

export { ComponentsRegistry }
