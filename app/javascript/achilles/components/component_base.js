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
        return $(this.rootElementSelector());
    }

    rootElementSelector() {
        return `#${this.id}`;
    }
}

export { ComponentBase }
