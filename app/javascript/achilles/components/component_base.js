class ComponentBase {
    parentComponentId;
    id;
    defaultParams;
    mounted = false;

    constructor(id, parentComponentId = 'Page', defaultParams = []) {
        this.id = id;
        this.parentComponentId = parentComponentId;
        this.defaultParams = defaultParams;

        if(typeof id === 'undefined')
            throw('id cannot be undefined');
    }

    setup() {}
    teardown() {}

    get setupExecuted() {
        return this.mounted;
    }

    set setupExecuted(value) {
        this.mounted = value;
    }

    get teardownExecuted() {
        return !this.mounted;
    }

    set teardownExecuted(value) {
        if(value === true) {
            this.mounted = false;
        }
    }

    rootElement() {
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
