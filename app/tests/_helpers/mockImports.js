
function createFnsAndPropertiesDynamically(originalObject = {}) {
    return new Proxy(originalObject, {
        get(target, property) {

            if (!(property in target)) {
                target[property] = (...args) => createFnsAndPropertiesDynamically()
            }

            return target[property];
        },
        set(target, property, value) {

            target[property] = createFnsAndPropertiesDynamically()
            return true;
        },
        apply(target, thisArg, argumentsList) {

            return createFnsAndPropertiesDynamically()
        }
    });
}

// Function to override modules with proxies
function overrideModules(modules) {
    modules.forEach(originalModule => {
        Object.keys(originalModule).forEach(key => {
            originalModule[key] = createFnsAndPropertiesDynamically(originalModule[key]);
        });
    });
}

export { overrideModules };
