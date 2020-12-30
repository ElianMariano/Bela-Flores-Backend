import { Request, Response } from 'express'
import Utils from './utils'
import db from '../database/connection'

class ProductsController {
  public async index (req: Request, res: Response) {
    const { id } = req.params

    await db('products')
      .select('*')
      .where('id', id)
      .then(result => {
        const [product] = result
        return res.json(product)
      })
  }

  public async create (req: Request, res: Response) {
    const {
      email,
      name,
      price,
      description,
      splited_price: splitedPrice,
      division_quantity: divisionQuantity,
      category
    } = req.body
    const { auth } = req.headers

    await db('category')
      .select('category')
      .where({ category })
      .then(result => {
        if (result.length === 0) {
          return res
            .status(404)
            .json({
              error: 'Category does not exist!'
            })
        }
      })
      .catch(Error)

    await Utils.isAdmin(email)
      .then(async isAdmin => {
        if (isAdmin) {
          await Utils.isLoggedIn(email, String(auth))
            .then(async isLoggedIn => {
              if (isLoggedIn) {
                const result = await db('products')
                  .insert({
                    name,
                    price,
                    description,
                    splited_price: splitedPrice,
                    division_quantity: divisionQuantity,
                    category_id: category
                  })

                const [id] = result

                return res.status(200).json({ id })
              }
            })
            .catch(Error)
        }

        return res
          .status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async update (req: Request, res: Response) {
    const {
      email,
      id,
      name,
      price,
      description,
      splited_price: splitedPrice,
      division_quantity: divisionQuantity,
      category
    } = req.body
    const { auth } = req.headers

    await db('category')
      .select('category')
      .where({ category })
      .then(result => {
        if (result.length === 0) {
          return res
            .status(404)
            .json({
              error: 'Category does not exist!'
            })
        }
      })
      .catch(Error)

    await Utils.isAdmin(email)
      .then(async isAdmin => {
        if (isAdmin) {
          await Utils.isLoggedIn(email, String(auth))
            .then(async isLoggedIn => {
              if (isLoggedIn) {
                await db('products')
                  .update({
                    name,
                    price,
                    description,
                    splited_price: splitedPrice,
                    division_quantity: divisionQuantity,
                    category_id: category
                  })
                  .where('id', id)
                  .then(() => {
                    return res.sendStatus(200)
                  })
              }
            })
            .catch(Error)
        }

        return res
          .status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async delete (req: Request, res: Response) {
    const { email, id } = req.body
    const { auth } = req.headers

    await Utils.isAdmin(email)
      .then(async isAdmin => {
        if (isAdmin) {
          await Utils.isLoggedIn(email, String(auth))
            .then(async isLoggedIn => {
              if (isLoggedIn) {
                await db('products')
                  .where('id', id)
                  .delete()

                return res.sendStatus(200)
              }
            })
        }

        return res
          .status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }
}

export default new ProductsController()
