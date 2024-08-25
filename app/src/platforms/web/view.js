import ViewBase from "../../shared/viewBase.js"

export default class View extends ViewBase {
    #btnFormClear = document.querySelector('#btnFormClear')
    #form = document.querySelector('#form')
    #tableBody = document.querySelector('.flex-table')
    #name = document.querySelector('#name')
    #age = document.querySelector('#age')
    #email = document.querySelector('#email')

    init() {
        this.configureFormSubmit()
        this.configureFormClear()
    }

    configureFormSubmit(fn) {
        this.#form.addEventListener('submit', event => {
            event.preventDefault()

            const name = this.#name.value
            const age = this.#age.value
            const email = this.#email.value

            return fn({ name, age, email })
        })
    }
    resetForm() {
        this.#form.reset()
    }

    notify({ msg, isError }) {
        alert('Please fill out all fields.')
    }


    configureFormClear() {
        this.#btnFormClear.addEventListener('click', () => {
            this.resetForm()
        })
    }

    addRow(newData) {
        const row = document.createElement('div')
        row.classList.add('flex-table-row')

        row.innerHTML = `
            <div>${newData.name}</div>
            <div>${newData.age}</div>
            <div>${newData.email}</div>
        `

        this.#tableBody.appendChild(row)
    }

    render(items) {
        items.forEach(item => this.addRow(item))
    }

}
