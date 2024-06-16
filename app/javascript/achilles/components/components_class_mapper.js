// Single Responsibility: Contains the list of all view components so it can be instantiated
class ComponentsClassMapper {
    _componentsClassMapper = {};

    addComponentClass(key, klass) {
        this._componentsClassMapper[key] = klass;
    }

    getComponentClass(key) {
        return (this._componentsClassMapper[key] || null);
    }
}

export { ComponentsClassMapper }
