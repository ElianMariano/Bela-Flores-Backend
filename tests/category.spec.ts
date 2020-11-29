import request from 'supertest'
import app from '../src/app'
import connection from '../src/database/connection'

describe('category', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
    await connection.seed.run()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to receive a category profile', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'MyCategory'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    await request(app)
      .post('/category')
      .send({
        email,
        category,
        description: 'My Description'
      })
      .set({ auth })

    response = await request(app)
      .get(`/category/${category}`)

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to receive all categories', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'MyCategory2'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    await request(app)
      .post('/category')
      .send({
        email,
        category,
        description: 'My Description'
      })
      .set({ auth })

    response = await request(app)
      .get('/category')

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to create a new category', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'MyCategory3'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    response = await request(app)
      .post('/category')
      .send({
        email,
        category,
        description: 'My Description'
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to update the category', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'MyCategory4'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    await request(app)
      .post('/category')
      .send({
        email,
        category,
        description: 'My Description'
      })
      .set({ auth })

    response = await request(app)
      .put('/category')
      .send({
        email,
        category,
        new_category: 'My new Category',
        description: 'Description updated'
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to delete the category', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'MyCategory5'

    let response = await request(app)
      .post('/login')
      .send({
        email,
        password
      })

    const { auth } = response.headers

    response = await request(app)
      .post('/category')
      .send({
        email,
        category,
        description: 'My Description'
      })
      .set({ auth })

    response = await request(app)
      .delete('/category')
      .send({
        email,
        category
      })
      .set({ auth })
  })
})
