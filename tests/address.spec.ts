import request from 'supertest'
import app from '../src/app'
import connection from '../src/database/connection'

describe('address', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
      .then(async () => {
        await connection.migrate.latest()
          .then(async () => {
            await connection.seed.run()
          })
      })
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to receive all address', async () => {
    const email = 'email@gmail.com'
    const password = 'password'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    response = await request(app)
      .get('/address')
      .send({
        email
      })
      .set({ auth })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('error')
  })

  it('should be able to create a new address', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const nickname = 'Address'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    response = await request(app)
      .post('/address')
      .send({
        email,
        nickname,
        UF: 'ES',
        city: 'Marataizes',
        neighborhood: 'Bairro',
        street: 'street',
        number: 10,
        CEP: '00000000'
      })
      .set({ auth })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to update an address', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const nickname = 'Address2'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    response = await request(app)
      .post('/address')
      .send({
        email,
        nickname,
        UF: 'ES',
        city: 'Marataizes',
        neighborhood: 'Bairro',
        street: 'street',
        number: 10,
        CEP: '00000000'
      })
      .set({ auth })

    response = await request(app)
      .put('/address')
      .send({
        email,
        new_nickname: 'Address changed',
        UF: 'ES',
        city: 'Marataizes',
        neighborhood: 'Bairro',
        street: 'street',
        number: 10,
        CEP: '00000000',
        nickname,
        id: response.body.id
      })
      .set({ auth })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('error')
  })

  it('should be able to delete an address', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const nickname = 'address3'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    response = await request(app)
      .post('/address')
      .send({
        email,
        nickname,
        UF: 'ES',
        city: 'Marataizes',
        neighborhood: 'Bairro',
        street: 'street',
        number: 10,
        CEP: '00000000'
      })
      .set({ auth })

    response = await request(app)
      .delete('/address')
      .send({
        email,
        id: response.body.id
      })
      .set({ auth })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('error')
  })
})
