import { Request, Response } from 'express'
import Utils from './utils'
import db from '../database/connection'

class CartController {
  public async index (req: Request, res: Response) {
    const { email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          const [{ id: userId }] = await db('users')
            .select('id')
            .where({ email })

          const carts = await db('cart')
            .select('*')
            .where({ user_id: userId })

          return res.status(200)
            .json(carts)
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
      quantity
    } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          const [{ id: product }] = await db('products')
            .select('id')
            .where({ id: productId })

          if (product === undefined) {
            return res.status(404)
              .json({
                error: 'This product does not exists!'
              })
          }

          const [{ id: userId }] = await db('users')
            .select('id')
            .where({ email })

          const [id] = await db('cart')
            .insert({
              user_id: userId,
              product_id: productId,
              quantity
            })

          return res.status(200)
            .json({ id })
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
      id,
      email,
      product_id: productId,
      quantity
    } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          const [{ id: product }] = await db('products')
            .select('id')
            .where({ id: productId })

          if (product === undefined) {
            return res.status(404)
              .json({
                error: 'This product does not exists!'
              })
          }

          await db('cart')
            .update({
              product_id: productId,
              quantity
            })
            .where({ id })

          return res.status(200)
            .json({ id })
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async delete (req: Request, res: Response) {
    const { email } = req.body
    const { auth } = req.headers
    const { id } = req.params

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          const [{ id: cartId }] = await db('cart')
            .select('id')
            .where({ id })

          if (cartId === undefined) {
            return res.status(404)
              .json({
                error: 'Could not find the cart!'
              })
          }

          await db('cart')
            .where({ id })
            .delete()

          return res.sendStatus(200)
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }
}

export default new CartController()
