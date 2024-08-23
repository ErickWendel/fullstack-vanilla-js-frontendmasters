import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default class LayoutBuilder {
    #screen;
    #layout;
    #table;
    #form;
    #inputs = {};
    #buttons = {};

    #baseComponent() {
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollboard: {
                ch: ' ',
                inverse: true
            },
            tags: true
        };
    }

    #createButton({ parent, name, content, bg, fg, left, bottom }) {
        return blessed.button({
            parent,
            mouse: true,
            keys: true,
            shrink: true,
            padding: { left: 1, right: 1 },
            left,
            bottom,
            width: 'shrink',
            name,
            content,
            style: {
                bg,
                fg,
                focus: { bg: `light${bg}` },
                hover: { bg: `light${bg}` }
            }
        });
    }

    #createInputField({ parent, name, top, label }) {
        const input = blessed.textbox({
            parent,
            name,
            inputOnFocus: true,
            top,
            left: 'center',
            width: '60%',
            height: '20%',
            border: { type: 'line' },
            style: {
                fg: 'white',
                bg: 'blue',
                focus: { bg: 'lightblue' }
            },
            label
        });

        // input.on('click', () => {
        //     input.focus()
        //     this.#screen.render();
        // });
        return input
    }

    setLayoutComponent() {
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%'
        });

        return this;
    }

    setScreen({ title }) {
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        });

        this.#screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

        return this;
    }

    setFormComponent({
        onSubmit,
        onClear,
    }) {
        const form = blessed.form({
            parent: this.#layout,
            keys: true,
            vi: false,
            width: '100%',
            height: '40%',
            top: '0',
            left: 'center',
            bg: 'green',
            label: 'User Form',
            border: { type: 'line' },
            style: {
                fg: 'white',
                bg: 'black'
            }
        });

        const nameInput = this.#createInputField({ parent: form, name: 'name', top: 1, label: 'Name:' });
        const ageInput = this.#createInputField({ parent: form, name: 'age', top: 4, label: 'Age:' });
        const emailInput = this.#createInputField({ parent: form, name: 'email', top: 7, label: 'Email:' });

        const submitButton = this.#createButton({
            parent: form,
            name: 'submit',
            content: 'Submit',
            bg: 'green',
            fg: 'white',
            left: 'center',
            bottom: 1
        });

        const clearButton = this.#createButton({
            parent: form,
            name: 'clear',
            content: 'Clear',
            bg: 'red',
            fg: 'white',
            left: '55%',
            bottom: 1
        });

        submitButton.on('press', () => form.submit());
        clearButton.on('press', () => onClear());

        form.on('submit', (data) => onSubmit(data));

        nameInput.focus();

        form.key(['enter'], (ch, key) => {
            form.focusNext();
        });

        // Handle Tab key to navigate form fields
        form.key(['tab'], (ch, key) => {
            if (!key.shift) {
                form.focusNext();
            } else {
                form.focusPrevious();
            }
        });

        this.#form = form;
        this.#inputs.name = nameInput
        this.#inputs.age = ageInput
        this.#inputs.email = emailInput
        this.#buttons.clear = clearButton
        this.#buttons.submit = submitButton

        return this;
    }

    setTable(template) {
        const numColumns = template.headers.length;

        const calculateColumnWidth = () => Math.floor(this.#layout.width / numColumns);
        const columnWidth = calculateColumnWidth();

        const minColumnWidth = 10; // Minimum column width in pixels
        const columnWidths = Array(numColumns).fill(columnWidth).map(width => Math.max(width, minColumnWidth));

        this.#table = contrib.table({
            ...this.#baseComponent(),
            parent: this.#layout,
            keys: true,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'blue',
            interactive: true,
            label: 'Users',
            width: '100%',  // Full width of the parent container
            height: '50%',  // Adjust height as needed
            top: '0',
            left: '0',      // Adjust positioning as needed
            border: { type: 'line', fg: 'cyan' },
            columnSpacing: 2, // Adjust spacing between columns
            columnWidth: columnWidths
        });

        this.#table.setData({
            headers: template.headers,
            data: template.data
        });

        return this;
    }

    build() {
        const components = {
            screen: this.#screen,
            table: this.#table,
            form: this.#form,
            inputs: this.#inputs,
            buttons: this.#buttons,
        };

        this.#screen.render();

        return components;
    }
}
