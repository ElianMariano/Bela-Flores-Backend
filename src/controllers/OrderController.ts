import { Request, Response } from 'express'
import Utils from './utils'
import db from '../database/connection'

class OrderController {
  public async index (req: Request, res: Response) {
    const { email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          const [{ id }] = await db('users')
            .select('id')
            .where({ email })

          if (id === undefined) {
            return res.status(400)
              .json({
                error: 'User not found!'
              })
          }

          const order = await db('order')
            .select('*')
            .where({ user_id: id })

          return res.status(200)
            .json(order)
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async create (req: Request, res: Response) {
    const {
      email,
      product_id: productId,
      address_id: addressId,
      status,
      quantity,
      division_quantity: divisionQuantity,
      is_gift: isGift,
      message
    } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          const [{ id: userId }] = await db('users')
            .select('id')
            .where({ email })

          if (userId === undefined) {
            return res.status(404)
              .json({
                error: 'User not found!'
              })
          }

          const [{ id }] = await db('products')
            .select('id')
            .where({ id: productId })

          if (id === undefined) {
            return res.status(404)
              .json({
                error: 'Product not found!'
              })
          }

          const [{ id: address }] = await db('address')
            .select('id')
            .where({ id: addressId })

          if (address === undefined) {
            return res.status(404)
              .json({
                error: 'Address not found!'
              })
          }

          const statusOptions = ['PENDING', 'CANCELLED', 'SUCCESS']

          if (!statusOptions.includes(status)) {
            return res.status(400)
              .json({
                error: 'Invalid status!'
              })
          }

          const [{ division }] = await db('products')
            .select(['division_quantity'])
            .where({ id: productId })

          if (divisionQuantity > division) {
            return res.status(400)
              .json({
                error: 'Too much division for price!'
              })
          }

          const [orderId] = await db('order')
            .insert({
              user_id: userId,
              product_id: productId,
              address_id: addressId,
              status,
              quantity,
              division_quantity: divisionQuantity,
              is_gift: isGift,
              message
            })

          return res.status(200)
            .json({ id: orderId })
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async update (req: Request, res: Response) {
    const {
      id: orderId,
      email,
      product_id: productId,
      address_id: addressId,
      status,
      quantity,
      division_quantity: divisionQuantity,
      is_gift: isGift,
      message
    } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                const [{ id }] = await db('products')
                  .select('id')
                  .where({ id: productId })

                if (id === undefined) {
                  return res.status(404)
                    .json({
                      error: 'Product not found!'
                    })
                }

                const [{ id: address }] = await db('address')
                  .select('id')
                  .where({ id: addressId })

                if (address === undefined) {
                  return res.status(404)
                    .json({
                      error: 'Address not found!'
                    })
                }

                const statusOptions = ['PENDING', 'CANCELLED', 'SUCCESS']

                if (!statusOptions.includes(status)) {
                  return res.status(400)
                    .json({
                      error: 'Invalid status!'
                    })
                }

                const [{ division }] = await db('products')
                  .select(['division_quantity'])
                  .where({ id: productId })

                if (divisionQuantity > division) {
                  return res.status(400)
                    .json({
                      error: 'Too much division for price!'
                    })
                }

                await db('order')
                  .update({
                    product_id: productId,
                    address_id: addressId,
                    status,
                    quantity,
                    division_quantity: divisionQuantity,
                    is_gift: isGift,
                    message
                  })
                  .where({ id: orderId })

                return res.status(200)
                  .json({ id: orderId })
              }
            })
            .catch(Error)
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async delete (req: Request, res: Response) {
    const { id } = req.params
    const { email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('order')
                  .where({ id })
                  .delete()

                return res.sendStatus(200)
              }
            })
            .catch(Error)
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }
}

export default new OrderController()
