import {
  once
} from 'node:events'
import User from '../entities/user.js'
import {
  DEFAULT_HEADER
} from '../util/util.js'

const routes = ({
  userService
}) => ({
  '/users:get': async (request, response) => {
    const users = await userService.find()
    response.writeHead(200, DEFAULT_HEADER)

    response.write(JSON.stringify(users))
    return response.end()
  },

  '/users:post': async (request, response) => {
    const data = await once(request, 'data')
    const item = JSON.parse(data)
    const hero = new User(item)

    const id = await userService.create(hero)

    response.writeHead(201, DEFAULT_HEADER)
    response.write(JSON.stringify({
      id,
      success: 'User created with success!!',
    }))

    return response.end()
  },
})

export {
  routes
}