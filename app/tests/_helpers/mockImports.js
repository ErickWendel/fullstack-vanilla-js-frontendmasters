import { mock } from 'node:test';

const mockPrivateKey = Symbol('mockKey');
const mockKey = 'mock';

// Function to create or retrieve a spy and apply it to a method
function createAndApplySpy(target, property, fn) {
    let spy = target[property]?.[mockPrivateKey];

    if (!spy) {
        spy = mock.fn();
        target[property] = spy;
        target[property][mockPrivateKey] = spy;
        target[property][mockKey] = spy.mock;
    }

    return (...args) => {
        spy(...args);
        return fn.apply(this, args);
    };
}

// Function to create a proxy with dynamic functions and properties
function createFnsAndPropertiesDynamically(originalObject) {
    return new Proxy(originalObject || {}, {
        get(target, property) {
            if ([mockKey, mockPrivateKey].includes(property)) {
                return target[property];
            }

            if (!(property in target)) {
                target[property] = mock.fn((...args) => createFnsAndPropertiesDynamically());
                target[property][mockPrivateKey] = target[property];
                target[property][mockKey] = target[property].mock;
            }

            return target[property];
        },
        set(target, property, value) {
            if ([mockKey, mockPrivateKey].includes(property)) {
                target[property] = value;
                return true;
            }

            target[property] = createFnsAndPropertiesDynamically(value)
            return true;
        },
        apply(target, thisArg, argumentsList) {
            return createAndApplySpy(
                target,
                target.name,
                (...args) => createFnsAndPropertiesDynamically(target)
            ).apply(this, argumentsList);
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
