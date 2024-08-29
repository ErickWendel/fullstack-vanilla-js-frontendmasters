// import Controller from "../src/shared/controller.js";
// import View from '../src/platforms/console/view.js';

// import { describe, it, before } from 'node:test';
// import assert from 'node:assert';

// import blessed from 'blessed';
// import contrib from 'blessed-contrib';
// import { overrideModules } from "./_helpers/mockImports.js";

// describe('CLI Test Suite', () => {
//     before(() => {
//         overrideModules([blessed, contrib]);
//     });

//     it('should initialize blessed, submit a form, add row and clean up form', async (context) => {
//         const view = new View();

//         const screenMock = context.mock.method(blessed, "screen");
//         const tableMockMock = context.mock.method(contrib, "table");

//         const onSubmit = context.mock.fn()
//         const onReset = context.mock.fn()

//         context.mock.method(blessed, 'form', (...args) => {
//             return {
//                 on: onSubmit,
//                 reset: onReset
//             }
//         })

//         const addRow = context.mock.method(view, view.addRow.name);
//         const resetForm = context.mock.method(view, view.resetForm.name);

//         await Controller.init({
//             view: view,
//             service: {
//                 createUser: context.mock.fn(),
//                 getUsers: context.mock.fn(async () => []),
//             }
//         });

//         assert.strictEqual(screenMock.mock.callCount(), 1);
//         assert.strictEqual(tableMockMock.mock.callCount(), 1);

//         const onSubmitMock = onSubmit.mock
//         assert.strictEqual(onSubmitMock.callCount(), 1);

//         const onSubmitFn = onSubmitMock.calls[0].arguments[1]
//         const data = { name: 'Erick Wendel', age: 28, email: 'e@e.com' }
//         onSubmitFn(data)

//         assert.strictEqual(addRow.mock.callCount(), 1)
//         assert.strictEqual(resetForm.mock.callCount(), 1)

//     });
// });
