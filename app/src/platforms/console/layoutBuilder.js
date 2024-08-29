import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default class LayoutBuilder {
    #screen;
    #layout;
    #table;
    #form;
    #inputs = {};
    #buttons = {};
    #alert

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
        nameInput.focus();

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

        form.on('submit', (data) => {
            onSubmit(data)
        });
        clearButton.on('press', () => onClear());

        this.#form = form;
        this.#inputs.name = nameInput
        this.#inputs.age = ageInput
        this.#inputs.email = emailInput
        this.#buttons.clear = clearButton
        this.#buttons.submit = submitButton

        return this;
    }

    setTable({ numColumns }) {
        const calculateColumnWidth = () => Math.floor(this.#layout.width / numColumns);
        const columnWidth = calculateColumnWidth();

        const minColumnWidth = 10;
        const columnWidths = Array(numColumns)
            .fill(columnWidth).map(width => Math.max(width, minColumnWidth));

        this.#table = contrib.table({
            mouse: true,
            scrollboard: {
                ch: ' ',
                inverse: true
            },
            tags: true,
            parent: this.#layout,
            keys: true,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'blue',
            interactive: true,
            label: 'Users',
            width: '100%',
            height: '50%',
            top: '0',
            left: '0',
            border: { type: 'line', fg: 'cyan' },
            columnSpacing: 2,
            columnWidth: columnWidths
        });

        return this;
    }

    setAlertComponent() {
        this.#alert = blessed.box({
            parent: this.#form,
            width: '40%',
            height: '20%',
            bottom: 0,
            border: {
                type: 'line'
            },
            style: {
                fg: 'black',
                bg: 'red',
            },
            content: '',
            tags: true,
            align: 'center',
            hidden: true,
        });

        this.#alert.setMessage = (message) => {
            this.#alert.setContent(`{bold}${message}{/bold}`);
            this.#alert.show();
            this.#screen.render();

            setTimeout(() => {
                this.#alert.hide();
                this.#screen.render();
            }, 3000);
        }

        return this;
    }


    build() {
        const components = {
            screen: this.#screen,
            table: this.#table,
            form: this.#form,
            inputs: this.#inputs,
            buttons: this.#buttons,
            alert: this.#alert
        };

        return components;
    }
}
