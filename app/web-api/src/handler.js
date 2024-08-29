
import {
  join,
  dirname
} from 'node:path'

import {
  fileURLToPath
} from 'node:url'

import {
  parse
} from 'node:url'
import { routes } from './routes/userRoute.js'
import {
  DEFAULT_HEADER
} from './util/util.js'

import { generateInstance } from './factories/userFactory.js'

const currentDir = dirname(
  fileURLToPath(
    import.meta.url
  )
)
const filePath = join(currentDir, './../database', 'data.json')

const userService = generateInstance({
  filePath
})

const userRoutes = routes({
  userService
})

const allRoutes = {
  ...userRoutes,

  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER)
    response.write(JSON.stringify({ message: 'uuuuups, not found!' }))
    response.end()
  }
}

function handler(request, response) {
  const {
    url,
    method
  } = request

  const {
    pathname
  } = parse(url, true)

  const key = `${pathname}:${method.toLowerCase()}`
  const chosen = allRoutes[key] || allRoutes.default

  return Promise.resolve(chosen(request, response))
    .catch(handlerError(response))
}

function handlerError(response) {
  return error => {
    console.log('Something bad has  happened**', error.stack)
    response.writeHead(500, DEFAULT_HEADER)
    response.write(JSON.stringify({
      error: 'internet server error!!'
    }))

    return response.end()
  }
}

export default handler