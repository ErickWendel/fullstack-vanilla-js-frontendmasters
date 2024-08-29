#!/usr/bin/env node

import Controller from "../src/shared/controller.js"
import Service from "../src/shared/service.js"

const API_URL = 'http://localhost:3000'

const path = globalThis.window ? 'web' : 'console'
const { default: View } = await import(`./../src/platforms/${path}/view.js`)

Controller.init({
    view: new View(),
    service: new Service({ url: API_URL })
})

