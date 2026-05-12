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
        return document.getElementById(this.id);
    }

    rootElementSelector() {
        return `#${CSS.escape(this.id)}`;
    }
}

export { ComponentBase }
