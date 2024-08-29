import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { promisify } from 'node:util'
import { server } from '../../src/index.js'

describe('Users E2E Test Suite', () => {
  let _usersUrl = '';
  before(async () => {
    const instance = server.listen()

    await new Promise((resolve, reject) => {
      instance.on('listening', resolve)
      instance.on('error', reject)
    });

    const { port } = server.address();
    _usersUrl = `http://localhost:${port}/users`;
  })

  after(async () => {
    await promisify(server.close.bind(server))()
  })

  it('it should create a user', async () => {
    const data = {
      name: "Batman",
      age: 50,
      email: "rich@e.com"
    }

    const request = await fetch(_usersUrl, {
      method: 'POST',
      body: JSON.stringify(data)
    })

    assert.deepStrictEqual(
      request.headers.get('content-type'),
      'application/json'
    )

    assert.strictEqual(request.status, 201)

    const result = await request.json()
    assert.deepStrictEqual(
      result.success,
      'User created with success!!',
      'it should return a valid text message'
    )

  })


})