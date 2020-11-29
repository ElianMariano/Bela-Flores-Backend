import request from 'supertest'
import app from '../src/app'
import connection from '../src/database/connection'

describe('users', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
    // await connection.seed.run()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to receive user information', async () => {
    let response = await request(app)
      .post('/user')
      .send({
        name: 'Name',
        phone: '(00) 00000-0000',
        email: 'myemail@gmail.com',
        password: 'password'
      })

    response = await request(app)
      .get(`/profile/${response.body.id}`)
      .send({
        email: 'myemail@gmail.com'
      })
      .set({ auth: response.headers.auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('name')
    expect(response.body).toHaveProperty('email')
    expect(response.body).toHaveProperty('phone')
  })

  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        name: 'Name',
        phone: '(00) 00000-0000',
        email: 'myemail2@gmail.com',
        password: 'password'
      })

    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.headers).toHaveProperty('auth')
  })

  it('should be able update a user', async () => {
    let response = await request(app)
      .post('/user')
      .send({
        name: 'Name',
        phone: '(00) 00000-0000',
        email: 'myemail3@gmail.com',
        password: 'password'
      })

    response = await request(app)
      .put('/user')
      .send({
        id: response.body.id,
        name: 'Name',
        phone: '(00) 00000-0000',
        email: 'myemail3@gmail.com'
      })
      .set({ auth: response.header.auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to delete a user', async () => {
    let response = await request(app)
      .post('/user')
      .send({
        name: 'Name',
        phone: '(00) 00000-0000',
        email: 'myemail4@gmail.com',
        password: 'password'
      })

    response = await request(app)
      .delete(`/user/${response.body.id}`)
      .send({
        email: 'myemail4@gmail.com'
      })
      .set({ auth: response.headers.auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to login with a user', async () => {
    const email = 'myemail5@gmail.com'
    const password = 'password'

    let response = await request(app)
      .post('/user')
      .send({
        name: 'Name',
        phone: '(00) 00000-0000',
        email,
        password
      })

    response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name')
    expect(response.headers).toHaveProperty('auth')
  })

  it('should be able to logout with a user', async () => {
    const email = 'myemail6@gmail.com'

    let response = await request(app)
      .post('/user')
      .send({
        name: 'Name',
        phone: '(00) 00000-0000',
        email,
        password: 'password'
      })

    const { id } = response.body
    const { auth } = response.headers

    response = await request(app)
      .post('/logout')
      .send({
        id,
        email
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })
})
