import { Request, Response } from 'express'
import db from '../database/connection'
import Utils from './utils'

class CategoryController {
  public async profile (req: Request, res: Response) {
    const { category } = req.params
    const {
      with_products: withProducts = false,
      count = 1,
      page = 1
    } = req.query

    const [data] = await db('category')
      .select('*')
      .where('category', category)

    if (data === {} || data === undefined) {
      res.status(404)
        .send({
          error: 'Category not found!'
        })
    }

    if (!withProducts) { return res.status(200).json(data) }

    // Request products
    const products = await db('products')
      .select(['id', 'name', 'price', 'description', 'splited_price', 'division_quantity'])
      .where('category_id', category)
      .orderBy('id', 'desc')
      .limit(Number(count))
      .offset((Number(page) - 1) * Number(count))

    const productsImg = products.map(async element => {
      const images = await db('product_images')
        .select('link')
        .where('product_id', element.id)

      const product = element
      product.images = images

      return product
    })

    const productImages = await Promise.all(productsImg)

    return res.status(200).json({ ...data, productImages })
  }

  public async index (req: Request, res: Response) {
    const {
      with_products: withProducts = false,
      count = 1,
      page = 1
    } = req.query

    const categories = await db('category')
      .select('*')

    if (withProducts) {
      const promises = categories.map(async (element) => {
        const products = await db('products')
          .select(['id', 'name', 'price', 'description', 'splited_price', 'division_quantity'])
          .where('category_id', element.category)
          .orderBy('id', 'desc')
          .limit(Number(count))
          .offset((Number(page) - 1) * Number(count))

        const productsImg = products.map(async element => {
          const images = await db('product_images')
            .select('link')
            .where('product_id', element.id)

          const product = element
          product.images = images

          return product
        })

        const productsImage = await Promise.all(productsImg)

        const category = element
        category.products = productsImage

        return category
      })

      const data = await Promise.all(promises)

      return res.status(200).json(data)
    }

    return res.status(200).json(categories)
  }

  public async create (req: Request, res: Response) {
    const { email, category, description } = req.body
    const { auth } = req.headers

    const data = await db('category')
      .select('category')
      .where('category', category)

    if (data.length !== 0) {
      return res.status(406)
        .json({
          error: 'Category already exists!'
        })
    }

    await Utils.isLoggedIn(email, String(auth))
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
      category: CategoryId,
      new_category: newCategory,
      description
    } = req.body
    const { auth } = req.headers

    try {
      await db('category')
        .select('category')
        .where({ category: CategoryId })
        .then(result => {
          if (result.length === 0) {
            return res.status(404)
              .json({
                error: 'Category does not exist!'
              })
          }
        })
    } catch (err) {
      console.log(err)
    }

    let secondCategory
    try {
      [{ category: secondCategory }] = await db('category')
        .select('category')
        .where({ category: newCategory })
    } catch (err) {
      console.log(err)
    }

    if (secondCategory === newCategory) {
      return res.status(406)
        .json({
          error: 'Category already exists!'
        })
    }

    await Utils.isLoggedIn(email, String(auth))
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
    const { email, category: CategoryId } = req.body
    const { auth } = req.headers

    let category
    try {
      category = await db('category')
        .select('category')
        .where({ category: CategoryId })
        .then(result => {
          if (result.length === 0) {
            return res.status(404)
              .json({
                error: 'Category does not exist!'
              })
          }
        })
    } catch (err) {
      console.log(err)
    }

    await Utils.isLoggedIn(email, String(auth))
      .then(async loggedIn => {
        if (loggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('category')
                  .where({ category: CategoryId })
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
