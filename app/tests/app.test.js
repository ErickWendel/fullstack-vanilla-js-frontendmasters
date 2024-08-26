import Controller from "../src/shared/controller.js";
import View from '../src/platforms/console/view.js';

import { describe, it, before } from 'node:test';
import assert from 'node:assert';

import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { overrideModules } from "@erickwendel/mock-imports-and-spy";

describe('Controller Test Suite', () => {
    before(() => {
        overrideModules([blessed, contrib]);
    });

    it('should initialize blessed, submit a form, add row and clean up form', async (context) => {
        const view = new View();

        const screenMock = context.mock.method(blessed, "screen");
        const tableMockMock = context.mock.method(contrib, "table");

        const addRow = context.mock.method(view, view.addRow.name);
        const resetForm = context.mock.method(view, view.resetForm.name);

        await Controller.init({ view: view });

        assert.strictEqual(screenMock.mock.callCount(), 1);
        assert.strictEqual(tableMockMock.mock.callCount(), 1);

        const formCall = blessed.form.on.mock
        assert.strictEqual(formCall.callCount(), 1);

        const onSubmit = formCall.calls[0].arguments[1]
        const data = { name: 'Erick Wendel', age: 28, email: 'e@e.com' }
        onSubmit(data)

        assert.strictEqual(addRow.mock.callCount(), 1)
        assert.strictEqual(resetForm.mock.callCount(), 1)

    });
});
