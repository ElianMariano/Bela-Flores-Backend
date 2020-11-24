import { Request, Response } from 'express'
import db from '../database/connection'
import Utils from './utils'

class CategoryController {
  public async profile (req: Request, res: Response) {
    const { category } = req.params
    const { with_products: withProducts = false } = req.body

    const [data] = await db('category')
      .select('*')
      .where('category', category)

    // Request products

    if (data === {} || data === undefined) {
      res.status(404)
        .send({
          error: 'Category not found!'
        })
    } else { return res.status(200).json(data) }
  }

  public async index (req: Request, res: Response) {
    const { width_products: withProducts = false } = req.body

    const data = await db('category')
      .select('*')

    return res.status(200).json(data)
  }

  public async create (req: Request, res: Response) {
    const { email, auth, category, description } = req.body

    const data = await db('category')
      .select('category')
      .where('category', category)

    if (data.length !== 0) {
      return res.status(406)
        .json({
          error: 'Category already exists!'
        })
    }

    await Utils.isLoggedIn(email, auth)
      .then(async loggedIn => {
        if (loggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('category')
                  .insert({
                    category,
                    description
                  })

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

  public async update (req: Request, res: Response) {
    const {
      email,
      auth,
      category: CategoryId,
      new_category: newCategory,
      description
    } = req.body

    const category = await db('category')
      .select('category')
      .where({ category: CategoryId })

    if (category.length === 0) {
      return res.status(404)
        .json({
          error: 'Category does not exist!'
        })
    }

    const [{ category: secondCategory }] = await db('category')
      .select('category')
      .where({ category: newCategory })

    if (secondCategory === newCategory) {
      return res.status(406)
        .json({
          error: 'Category already exists!'
        })
    }

    await Utils.isLoggedIn(email, auth)
      .then(async loggedIn => {
        if (loggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('category')
                  .update({
                    category: newCategory,
                    description
                  })
                  .where({ category: CategoryId })

                return res.sendStatus(200)
              }

              return res.status(401)
                .json({
                  error: 'Unauthorized access!'
                })
            })
            .catch(Error)
        }
      })
      .catch(Error)
  }

  public async delete (req: Request, res: Response) {
    const { email, auth, category } = req.body

    await Utils.isLoggedIn(email, auth)
      .then(async loggedIn => {
        if (loggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('category')
                  .where({ category })
                  .delete()

                return res.sendStatus(200)
              }

              return res
                .status(401)
                .json({
                  error: 'Unauthorized access!'
                })
            })
            .catch(Error)
        }
      })
      .catch(Error)
  }
}

export default new CategoryController()
