import ViewBase from "../../shared/viewBase.js"
import LayoutBuilder from "./layoutBuilder.js"

export default class View extends ViewBase {
    #components
    #headers = []
    #firstRender = true
    #data = []  // Store the data submitted through the form
    #onSearch = () => { }


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
        // Add the new form data to the list
        this.#data.push(formData)
        this.#updateTable(this.#data)
    }
    configureFormClear() { }
    configureFormSubmit(fn) { }

    render(data) {
        // Initialize the data with the initial data passed to render
        this.#data = data;

        // if (!this.#firstRender) {
        //     this.#updateTable(data);
        //     return;
        // }

        const template = this.#prepareData(data)
        const layout = new LayoutBuilder()

        this.#components = layout
            .setScreen({ title: 'Design Patterns with Erick Wendel' })
            .setLayoutComponent()
            .setFormComponent(this.#handleFormSubmit)  // Add form handling
            .setTable(template)
            .build()

        this.#firstRender = false
    }
}
