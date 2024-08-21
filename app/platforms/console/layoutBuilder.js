import blessed from 'blessed';
import contrib from 'blessed-contrib';

export default class LayoutBuilder {
    #screen
    #layout
    #input
    #table
    #form

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

    setLayoutComponent() {
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%',
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
            width: '100%', // Set form width to 100%
            height: '40%', // Adjust height to fit within terminal
            top: '0', // Align to top
            left: 'center', // Align to center horizontally
            bg: 'green',
            label: 'User Form',
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'black',
            }
        });

        const createInputField = (name, top, label) => {
            return blessed.textbox({
                parent: form,
                name: name,
                inputOnFocus: true,
                top: top,
                left: 'center',
                width: '60%', // Adjust width to fit within form
                height: 3,
                border: {
                    type: 'line',
                },
                style: {
                    fg: 'white',
                    bg: 'blue',
                    focus: { bg: 'lightblue' }
                },
                label: label
            });
        };

        const nameInput = createInputField('name', 2, 'Name:');
        const ageInput = createInputField('age', 6, 'Age:');
        const emailInput = createInputField('email', 10, 'Email:');

        const submitButton = blessed.button({
            parent: form,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            left: '40%',
            bottom: 0,
            width: 'shrink',
            name: 'submit',
            content: 'Submit',
            style: {
                bg: 'green',
                fg: 'white',
                focus: {
                    bg: 'lightgreen'
                },
                hover: {
                    bg: 'lightgreen'
                }
            }
        });

        const clearButton = blessed.button({
            parent: form,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            bottom: 0,
            left: '55%', // Add spacing between buttons
            width: 'shrink',
            name: 'clear',
            content: 'Clear',
            style: {
                bg: 'red',
                fg: 'white',
                focus: {
                    bg: 'lightred'
                },
                hover: {
                    bg: 'lightred'
                }
            }
        });

        submitButton.on('press', () => {
            form.submit();
        });

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
        const totalWidth = 100; // Percentage of terminal width allocated to the table
        const columnSpacing = 1; // Space between columns
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
            width: '100%', // Set table width to 80% of terminal width
            height: '50%', // Adjust height to fit within terminal
            top: '40%', // Position below the form
            left: 'center', // Center horizontally
            border: { type: "line", fg: "cyan" },
            columnSpacing: columnSpacing, // Space between columns
            columnWidth: Array(numColumns).fill(columnWidth) // Set each column to the calculated width
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
