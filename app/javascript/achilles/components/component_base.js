class ComponentBase {
    parentComponentId;
    id;
    defaultParams;
    setupExecuted = false;
    teardownExecuted = false;

    constructor(id, parentComponentId = 'Page', defaultParams = []) {
        this.id = id;
        this.parentComponentId = parentComponentId;
        this.defaultParams = defaultParams;

        if(typeof id === 'undefined')
            throw('id cannot be undefined');
    }

    setup() {}
    teardown() {}

    rootElement() {
        if(typeof window.$ === 'function') {
            return window.$(this.rootElementSelector());
        }

        return this.rootNode();
    }

    rootNode() {
        return document.getElementById(this.id);
    }

    rootElementSelector() {
        if(window.CSS && typeof window.CSS.escape === 'function') {
            return `#${window.CSS.escape(this.id)}`;
        }

        return `#${this.id}`;
    }
}

export { ComponentBase }
