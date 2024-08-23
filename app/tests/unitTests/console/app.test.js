import Controller from "../../../src/shared/controller.js";
import View from './../../../src/platforms/console/view.js';

import { describe, it, mock, before } from 'node:test';
import assert from 'node:assert';

import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { overrideModules } from "../../_helpers/mockImports.js";

describe('Controller Test Suite', () => {
    before(() => {
        // fix bug as the internal name is different than the prop name
        contrib.Table = contrib.table;

        overrideModules([blessed, contrib]);
    });

    it('my test', async (context) => {
        const view = new View();
        const addRow = context.mock.method(view, view.addRow.name);
        const screenMock = context.mock.method(blessed, "screen")

        await Controller.init({ view: view });
        await Controller.init({ view: view });

        assert.strictEqual(screenMock.mock.callCount(), 2);

        const formCall = blessed.form.on.mock
        assert.strictEqual(formCall.callCount(), 2);

        const onSubmit = formCall.calls[0].arguments[1]
        const data = { name: 'Erick Wendel', age: 28, email: 'e@e.com' }
        onSubmit(data)

        assert.strictEqual(addRow.mock.calls.length, 1)

    });
});
