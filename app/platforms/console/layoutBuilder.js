import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default class LayoutBuilder {
    #screen;
    #layout;
    #input;
    #table;
    #form;

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
        return blessed.textbox({
            parent,
            name,
            inputOnFocus: true,
            top,
            left: 'center',
            width: '60%',
            height: 3,
            border: { type: 'line' },
            style: {
                fg: 'white',
                bg: 'blue',
                focus: { bg: 'lightblue' }
            },
            label
        });
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

    setFormComponent(onSubmit) {
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

        const nameInput = this.#createInputField({ parent: form, name: 'name', top: 2, label: 'Name:' });
        const ageInput = this.#createInputField({ parent: form, name: 'age', top: 6, label: 'Age:' });
        const emailInput = this.#createInputField({ parent: form, name: 'email', top: 10, label: 'Email:' });

        const submitButton = this.#createButton({
            parent: form,
            name: 'submit',
            content: 'Submit',
            bg: 'green',
            fg: 'white',
            left: 'center',
            bottom: 0
        });

        const clearButton = this.#createButton({
            parent: form,
            name: 'clear',
            content: 'Clear',
            bg: 'red',
            fg: 'white',
            left: '55%',
            bottom: 0
        });

        submitButton.on('press', () => form.submit());
        clearButton.on('press', () => {
            form.reset();
            nameInput.focus(); // Refocus on the first input field after clearing
        });

        form.on('submit', (data) => {
            onSubmit(data);
            form.reset();
            nameInput.focus(); // Refocus on the first input field after submission
            this.#screen.render();
        });

        // Set focus to the first input when the form is created
        nameInput.focus();

        // Handle focus on click
        [nameInput, ageInput, emailInput].forEach(el => {
            el.on('click', () => el.focus());
        });

        // Handle Enter key to move focus to the next field
        form.key(['enter'], (ch, key) => {
            form.focusNext();
            this.#screen.render();
        });

        // Handle Tab key to navigate form fields
        form.key(['tab'], (ch, key) => {
            if (!key.shift) {
                form.focusNext();
            } else {
                form.focusPrevious();
            }
            this.#screen.render();
        });

        // Handle Escape key to reset form
        form.key(['escape'], () => {
            form.reset();
            nameInput.focus();
            this.#screen.render();
        });

        this.#form = form;

        return this;
    }

    setTable(template) {
        const numColumns = template.headers.length;
        const totalWidth = 100;
        const columnSpacing = 1;
        const columnWidth = Math.floor((totalWidth - (numColumns - 1) * columnSpacing) / numColumns);

        this.#table = contrib.table({
            ...this.#baseComponent(),
            parent: this.#layout,
            keys: true,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'blue',
            interactive: true,
            label: 'Users',
            width: '100%',
            height: '50%',
            top: '40%',
            left: 'center',
            border: { type: 'line', fg: 'cyan' },
            columnSpacing,
            columnWidth: Array(numColumns).fill(columnWidth)
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
            input: this.#input,
            table: this.#table,
            form: this.#form
        };

        this.#input?.focus();
        this.#screen.render();

        return components;
    }
}
