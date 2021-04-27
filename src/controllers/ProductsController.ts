import { Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import Utils from './utils'
import db from '../database/connection'

interface ImageProps {
  id: number;
  // eslint-disable-next-line camelcase
  product_id: number;
  link: string;
}
// TODO Test the update route from this file
class ProductsController {
  public async profile (req: Request, res: Response) {
    const { id } = req.params

    const [product] = await db('products')
      .select('*')
      .where('id', id)

    const images : ImageProps[] = await db('product_images')
      .select('*')
      .where('product_id', id)

    const imageSource = images.map(image => {
      return image.link
    })

    return res.json({
      ...product,
      images: imageSource
    })
  }

  public async index (req: Request, res: Response) {
    const { with_images: withImages } = req.query

    const products = await db('products')
      .select('*')
      .orderBy('id')

    if (withImages === undefined || !withImages) { return res.json(products) }

    let productImages = products.map(async product => {
      const images : ImageProps[] = await db('product_images')
        .select(['link'])
        .where('product_id', product.id)

      const newProduct = {
        ...product,
        images
      }

      return newProduct
    })

    productImages = await Promise.all(productImages)

    return res.json(productImages)
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
                const trx = await db.transaction()

                const [id] = await trx('products')
                  .insert({
                    name,
                    price,
                    description,
                    splited_price: splitedPrice,
                    division_quantity: divisionQuantity,
                    category_id: category
                  })

                const images : string[] = []

                for (let i = 0; i < req.files.length; i++) { images.push(String(req.files[i].filename)) }

                for (const image of images) {
                  await trx('product_images')
                    .insert({
                      product_id: id,
                      link: `uploads/${image}`
                    })
                }

                await trx.commit()

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
                const trx = await db.transaction()

                const productImages : ImageProps[] = await trx('product_images')
                  .select('*')
                  .where({ product_id: id })

                await trx('product_images')
                  .where({ product_id: id })
                  .delete()
                  .then(() => {
                    try {
                      productImages.forEach(product => {
                        fs.unlinkSync(path.resolve(__dirname, '..', '..', String(product.link)))
                      })
                    } catch (err) {
                      console.log(err)
                    }
                  })

                const images : string[] = []

                for (let i = 0; i < req.files.length; i++) { images.push(String(req.files[i].filename)) }

                for (const image of images) {
                  await trx('product_images')
                    .insert({
                      product_id: id,
                      link: `uploads/${image}`
                    })
                }

                await trx('products')
                  .update({
                    name,
                    price,
                    description,
                    splited_price: splitedPrice,
                    division_quantity: divisionQuantity,
                    category_id: category
                  })
                  .where('id', id)

                await trx.commit()

                return res.sendStatus(200)
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
                const trx = await db.transaction()

                const productImages : ImageProps[] = await trx('product_images')
                  .select('*')
                  .where({ product_id: id })

                await trx('product_images')
                  .where({ product_id: id })
                  .delete()
                  .then(() => {
                    try {
                      productImages.forEach(product => {
                        fs.unlinkSync(path.resolve(__dirname, '..', '..', String(product.link)))
                      })
                    } catch (err) {
                      console.log(err)
                    }
                  })

                await trx('products')
                  .where('id', id)
                  .delete()

                await trx.commit()

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
