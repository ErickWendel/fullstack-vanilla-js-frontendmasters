import ViewBase from "../../shared/viewBase.js"
import LayoutBuilder from "./layoutBuilder.js"

export default class View extends ViewBase {
    #components
    #headers = []
    #data = []
    #layoutBuilder

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

        this.#headers = Object.keys(data[0]).slice(0, 3)
        return {
            headers: this.#headers,
            data: data.map(item => Object.values(item).slice(0, 3))
        }
    }

    #updateTable(data) {
        const template = this.#prepareData(data)
        this.#components.table.setData({
            headers: template.headers,
            data: template.data
        })
    }

    #handleFormSubmit = (formData) => {
        this.#data.push(formData)
        this.#updateTable(this.#data)
    }
    configureFormClear() { }
    configureFormSubmit(fn) { }

    render(data) {
        this.#data = data;

        const template = this.#prepareData(data)

        this.#components = this.#layoutBuilder
            .setScreen({ title: 'Design Patterns with Erick Wendel' })
            .setLayoutComponent()
            .setFormComponent(this.#handleFormSubmit)  // Add form handling
            .setTable(template)
            .build()
    }
}
