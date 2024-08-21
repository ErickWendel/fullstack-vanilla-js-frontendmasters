import Controller from "../shared/controller.js"

const path = globalThis.window ? 'web' : 'console'
const { default: View } = await import(`./../platforms/${path}/view.js`)

Controller.init({
    view: new View(),
})

