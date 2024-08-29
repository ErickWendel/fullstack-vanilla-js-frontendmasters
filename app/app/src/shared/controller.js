
// Controller.init()
/**
 * @typedef {import('./viewBase.js').default} View
 * @typedef {import('./service.js').default} Service
 */
export default class Controller {
    /** @type {View} */
    #view
    #service
    /** @param { {view: View, service: Service} } deps */
    constructor({ view, service }) {
        this.#view = view
        this.#service = service
    }

    static async init(deps) {
        const controller = new Controller(deps)
        await controller.#init()
        return controller
    }

    #isValid(data) {
        return data.name && data.age && data.email
    }
    async #pushToAPI(data) {
        try {
            await this.#service.createUser(data)
        } catch (error) {
            this.#view.notify({ msg: 'server is not available!' })
        }
    }

    async #getFromAPI() {
        try {
            const users = await this.#service.getUsers()
            return users
        } catch (error) {
            this.#view.notify({ msg: 'server is not available!' })
            return []
        }
    }
    #onSubmit({ name, age, email }) {
        if (!this.#isValid({ name, age, email })) {
            this.#view.notify({ msg: 'Please, fill out all the fields.' })
            return
        }

        this.#view.addRow({ name, age, email })
        this.#view.resetForm()

        return this.#pushToAPI({ name, age, email })
    }

    #onClear() {

    }

    async #init() {
        this.#view.configureFormSubmit(this.#onSubmit.bind(this))
        this.#view.configureFormClear(this.#onClear.bind(this))

        const usersFromAPI = await this.#getFromAPI()
        const initialData = [
            { name: 'Erick Wendel', age: 28, email: 'erick@erick.com' },
            { name: 'Ana Neri', age: 24, email: 'ana@ana.com' },
            { name: 'Marc Berg', age: 24, email: 'marc@marc.com' },
            ...usersFromAPI
        ]

        this.#view.render(initialData)
    }


}