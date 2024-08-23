import Controller from "../src/shared/controller.js"

const path = globalThis.window ? 'web' : 'console'
const { default: View } = await import(`./../src/platforms/${path}/view.js`)

Controller.init({
    view: new View(),
})

