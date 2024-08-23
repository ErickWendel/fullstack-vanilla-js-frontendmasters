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
        contrib.Table = contrib.table

        overrideModules([
            blessed,
            contrib
        ]);
    });

    it('my test', async (context) => {
        await Controller.init({ view: new View() });
        await Controller.init({ view: new View() });

        // Assert that blessed.screen was called
        assert.strictEqual(blessed.screen.mock.calls.length, 2);
        assert.strictEqual(contrib.table.mock.calls.length, 2);
    });
});
