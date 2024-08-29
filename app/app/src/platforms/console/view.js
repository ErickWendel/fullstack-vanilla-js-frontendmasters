import ViewBase from "../../shared/viewBase.js"
import LayoutBuilder from "./layoutBuilder.js"

export default class View extends ViewBase {
    #components
    #headers = []
    #data = []
    #layoutBuilder
    #onFormClear = (fn) => { }
    #onFormSubmit = (fn) => { }

    constructor(layoutBuilder = new LayoutBuilder()) {
        super()

        this.#layoutBuilder = layoutBuilder
    }

    #prepareData(data) {
        if (!data.length) {
            return {
                headers: this.#headers,
                data: []
            }
        }

        this.#headers = Object.keys(data[0])
        return {
            headers: this.#headers,
            data: data.map(item => Object.values(item))
        }
    }

    addRow(data) {
        this.#data.push(data)
        const template = this.#prepareData(this.#data)
        this.#components.table.setData(template)
        this.#components.screen.render();
    }

    resetForm() {
        const form = this.#components.form
        form.reset();
        this.#components.screen.render();
    }

    notify({ msg, isError }) {
        this.#components?.alert.setMessage(msg)
    }

    configureFormClear() {
        this.#onFormClear = () => {
            this.#components.form.reset()
        }
    }

    configureFormSubmit(fn) {
        this.#onFormSubmit = (formData) => {
            return fn(formData)
        }
    }

    #initializeComponents() {
        this.#components = this.#layoutBuilder
            .setScreen({ title: 'Fullstack vanilla JS - Erick Wendel' })
            .setLayoutComponent()
            .setFormComponent({
                onSubmit: this.#onFormSubmit,
                onClear: this.#onFormClear,
            })
            .setAlertComponent()
            .setTable({ numColumns: 3 })
            .build()
    }

    render(items) {
        this.#initializeComponents()
        items.forEach(item => this.addRow(item))

    }
}
