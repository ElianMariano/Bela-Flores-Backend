import request from 'supertest'
import app from '../src/app'
import connection from '../src/database/connection'

describe('products', () => {
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

  it('should be able to return a product', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'

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
        category: 'mycategory',
        description: 'Descrição da categoria'
      })
      .set({ auth })

    response = await request(app)
      .post('/product')
      .send({
        email,
        name: 'Product name',
        price: 19.5,
        description: 'Product Description',
        splited_price: 19.5,
        quantity: 1,
        category
      })

    const { id } = response.body

    response = await request(app)
      .get(`/product/${id}`)

    expect(response.status).toBe(200)
  })

  it('should be able to create a product', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'

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
        category: 'mycategory',
        description: 'Descrição da categoria'
      })
      .set({ auth })

    response = await request(app)
      .post('/product')
      .send({
        email,
        name: 'Product name',
        price: 19.5,
        description: 'Product Description',
        splited_price: 19.5,
        quantity: 1,
        category
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('id')
  })

  it('should be able to update the product', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'

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
        category: 'mycategory',
        description: 'Descrição da categoria'
      })
      .set({ auth })

    const data = await request(app)
      .post('/product')
      .send({
        email,
        name: 'Product name',
        price: 19.5,
        description: 'Product Description',
        splited_price: 19.5,
        quantity: 1,
        category
      })
      .set({ auth })

    const id = data.body.id

    response = await request(app)
      .put('/product')
      .send({
        id,
        email,
        name: 'Product name updated',
        price: 20,
        description: 'Product Description updated',
        splited_price: 25,
        quantity: 2,
        category: 'mycategory'
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to delete the product', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'

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
        category: 'mycategory',
        description: 'Descrição da categoria'
      })
      .set({ auth })

    const data = await request(app)
      .post('/product')
      .send({
        email,
        name: 'Product name',
        price: 19.5,
        description: 'Product Description',
        splited_price: 19.5,
        quantity: 1,
        category
      })
      .set({ auth })

    const id = data.body.id

    response = await request(app)
      .delete('/product')
      .send({
        id,
        email
      })
      .set({ auth })

    expect(response.status).toBe(200)
    expect(response.body).not.toHaveProperty('error')
  })
})
