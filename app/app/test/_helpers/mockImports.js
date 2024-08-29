function createFnsAndPropertiesDynamically(originalObject = {}) {
    return new Proxy(originalObject, {
        // when a value is requested (const screen = blessed.screen())
        get(target, property) {

            if (!(property in target)) {
                target[property] = (...args) => createFnsAndPropertiesDynamically()
            }

            return target[property];
        },
        // when a function is called (blessed.screen())
        apply(target, thisArg, argumentsList) {
            return createFnsAndPropertiesDynamically()
        }
    });
}

function overrideModules(modules) {
    modules.forEach(originalModule => {
        Object.keys(originalModule).forEach(key => {
            originalModule[key] = createFnsAndPropertiesDynamically(originalModule[key]);
        });
    });
}

export { overrideModules };
