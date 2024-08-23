
/**
 * @typedef {import('./viewBase.js').default} View
 */

/**
 * Controller class that connects the view layer.
 */
export default class Controller {
    /** @type {View} */
    #view

    /**
     * Initializes a new instance of the Controller.
     * @param {{ view: View }} deps - The parameters for initializing the Controller.
     */
    constructor({ view }) {
        this.#view = view
    }

    /**
     * Validates the form data.
     * @param {Object} data - The form data to validate.
     * @param {string} data.name - The name to validate.
     * @param {number} data.age - The age to validate.
     * @param {string} data.email - The email to validate.
     * @returns {boolean} `true` if all fields are valid, otherwise `false`.
     */
    #isValid(data) {
        return data.name && data.age && data.email
    }

    /**
     * Asynchronously initializes a new instance of the Controller.
     * @param {{ view: View }} deps - The parameters for initializing the Controller.
     * @returns {Promise<Controller>} A promise that resolves to the initialized Controller instance.
     */
    static async init(deps) {
        const instance = new Controller(deps)
        await instance.#init()
        return instance
    }

    /**
     * Handles the form submission event.
     * @param {Object} formData - The submitted form data.
     * @param {string} formData.name - The name from the form.
     * @param {number} formData.age - The age from the form.
     * @param {string} formData.email - The email from the form.
     * @returns {boolean} `true` if the submission is valid and processed, otherwise `false`.
     */
    #onSubmit({ name, age, email }) {

        if (!this.#isValid({ name, age, email })) {
            this.#view.notify({
                msg: 'Invalid input',
                isError: true
            })
            return
        }

        const newData = { name, age, email }
        this.#view.addRow(newData)
        this.#view.resetForm()
    }

    /**
     * Initializes the Controller by setting up the view and loading initial data.
     * @private
     * @returns {Promise<void>}
     */
    async #init() {
        this.#view.configureFormSubmit(this.#onSubmit.bind(this))
        this.#view.configureFormClear()

        const initialData = [
            { name: 'Erick Wendel', age: 27, email: 'erick@erick.com' },
            { name: 'Ana Neri', age: 22, email: 'ana@gmail.com' },
            { name: 'Marc Berg', age: 54, email: 'zuck@gmail.com' },
        ]

        this.#view.render(initialData)
    }
}
