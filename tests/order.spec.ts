import request from 'supertest'
import app from '../src/app'
import connection from '../src/database/connection'

describe('order', () => {
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

  it('should be able to receive all orders', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'
    const address = {
      email,
      nickname: 'Address nickname',
      UF: 'ES',
      city: 'Marataizes',
      neighborhood: 'Bairro',
      street: 'street',
      number: 10,
      CEP: '00000000'
    }
    const product = {
      email,
      name: 'Product name',
      price: 19.5,
      description: 'Product Description',
      splited_price: 19.5,
      division_quantity: 1,
      category
    }

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
        description: 'My Category description'
      })
      .set({ auth })

    response = await request(app)
      .post('/product')
      .send(product)
      .set({ auth })

    const { id: productId } = response.body

    response = await request(app)
      .post('/address')
      .send(address)
      .set({ auth })

    const { id: addressId } = response.body

    await request(app)
      .post('/order')
      .send({
        email,
        product_id: productId,
        address_id: addressId,
        status: 'PENDING',
        quantity: 1,
        division_quantity: 1,
        is_gift: false,
        message: 'Order message'
      })
      .set({ auth })

    response = await request(app)
      .get('/order')
      .send({ email })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })

  it('should be able to create a new order', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'
    const address = {
      email,
      nickname: 'Address nickname',
      UF: 'ES',
      city: 'Marataizes',
      neighborhood: 'Bairro',
      street: 'street',
      number: 10,
      CEP: '00000000'
    }
    const product = {
      email,
      name: 'Product name',
      price: 19.5,
      description: 'Product Description',
      splited_price: 19.5,
      division_quantity: 1,
      category
    }

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
        description: 'My Category description'
      })
      .set({ auth })

    response = await request(app)
      .post('/product')
      .send(product)
      .set({ auth })

    const { id: productId } = response.body

    response = await request(app)
      .post('/address')
      .send(address)
      .set({ auth })

    const { id: addressId } = response.body

    response = await request(app)
      .post('/order')
      .send({
        email,
        product_id: productId,
        address_id: addressId,
        status: 'PENDING',
        quantity: 1,
        division_quantity: 1,
        is_gift: false,
        message: 'Order message'
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('id')
    expect(response.status).toBe(200)
  })

  it('should be able to update a order', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'
    const address = {
      email,
      nickname: 'Address nickname',
      UF: 'ES',
      city: 'Marataizes',
      neighborhood: 'Bairro',
      street: 'street',
      number: 10,
      CEP: '00000000'
    }
    const product = {
      email,
      name: 'Product name',
      price: 19.5,
      description: 'Product Description',
      splited_price: 19.5,
      division_quantity: 1,
      category
    }

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
        description: 'My Category description'
      })
      .set({ auth })

    response = await request(app)
      .post('/product')
      .send(product)
      .set({ auth })

    const { id: productId } = response.body

    response = await request(app)
      .post('/address')
      .send(address)
      .set({ auth })

    const { id: addressId } = response.body

    response = await request(app)
      .post('/order')
      .send({
        email,
        product_id: productId,
        address_id: addressId,
        status: 'PENDING',
        quantity: 1,
        division_quantity: 1,
        is_gift: false,
        message: 'Order message'
      })
      .set({ auth })

    const { id: orderId } = response.body

    response = await request(app)
      .put('/order')
      .send({
        email,
        id: orderId,
        product_id: productId,
        address_id: addressId,
        status: 'PENDING',
        quantity: 1,
        division_quantity: 1,
        is_gift: false,
        message: 'Order message updated'
      })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.body).toHaveProperty('id')
    expect(response.status).toBe(200)
  })

  it('should be able to delete a order', async () => {
    const email = 'email@gmail.com'
    const password = 'password'
    const category = 'mycategory'
    const address = {
      email,
      nickname: 'Address nickname',
      UF: 'ES',
      city: 'Marataizes',
      neighborhood: 'Bairro',
      street: 'street',
      number: 10,
      CEP: '00000000'
    }
    const product = {
      email,
      name: 'Product name',
      price: 19.5,
      description: 'Product Description',
      splited_price: 19.5,
      division_quantity: 1,
      category
    }

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
        description: 'My Category description'
      })
      .set({ auth })

    response = await request(app)
      .post('/product')
      .send(product)
      .set({ auth })

    const { id: productId } = response.body

    response = await request(app)
      .post('/address')
      .send(address)
      .set({ auth })

    const { id: addressId } = response.body

    response = await request(app)
      .post('/order')
      .send({
        email,
        product_id: productId,
        address_id: addressId,
        status: 'PENDING',
        quantity: 1,
        division_quantity: 1,
        is_gift: false,
        message: 'Order message'
      })
      .set({ auth })

    const { id: orderId } = response.body

    response = await request(app)
      .delete(`/order/${orderId}`)
      .send({ email })
      .set({ auth })

    expect(response.body).not.toHaveProperty('error')
    expect(response.status).toBe(200)
  })
})
