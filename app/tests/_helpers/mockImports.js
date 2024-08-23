import { mock } from 'node:test';

const mockPrivateKey = Symbol('mockKey')
const mockKey = 'mock'

const addSpy = (target, property, fn) => {
    if (!target[property]) return (...args) => fn.apply(this, ...args)

    const spy = target[property][mockPrivateKey] ?? mock.fn()
    target[property][mockPrivateKey] = spy
    target[property][mockKey] = spy.mock

    return (...args) => {
        spy(...args)

        return fn.apply(this, ...args)
    }

}
const createFnsAndPropertiesDynamically = (originalObject) => {
    return new Proxy(originalObject || {}, {
        get(target, property) {
            if ([mockKey, mockPrivateKey].includes(property)) {
                return target[property]
            }

            if (!(property in target)) {

                target[property] = (...args) => {
                    return createFnsAndPropertiesDynamically();
                };

            }

            return (target[property]);
        },
        set(target, property, value) {
            if ([mockKey, mockPrivateKey].includes(property)) {
                target[property] = value
                return true
            }

            target[property] = createFnsAndPropertiesDynamically(value);
            return true;
        },
        apply(target, thisArg, argumentsList) {

            return addSpy(thisArg, target.name, (...args) => {
                // console.log(`Function '${fnName}' was called with arguments:`, args);
                return createFnsAndPropertiesDynamically();
            }).apply(this, ...argumentsList);
        }
    });
};

const overrideModules = (modules) => {
    modules.forEach(originalModule => {
        Object.keys(originalModule).forEach(key => {
            originalModule[key] = createFnsAndPropertiesDynamically(originalModule[key]);
        });
    });
}

export { overrideModules }