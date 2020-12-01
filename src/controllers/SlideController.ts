import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import Utils from './utils'
import db from '../database/connection'

class SlideController {
  public async index (req: Request, res: Response) {
    await db('images')
      .select(['id', 'link', 'description'])
      .orderBy('id')
      .then(images => {
        return res.json(images)
      })
  }

  public async create (req: Request, res: Response) {
    const {
      email,
      description
    } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                const slide = {
                  link: `uploads/${req.file.filename}`,
                  description,
                  is_slide: true
                }

                const ids = await db('images').insert(slide)

                return res.send({ id: ids[0] })
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
    const { email, id, description } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('images')
                  .select('link')
                  .where({ id })
                  .then(async data => {
                    if (data[0].link === undefined) {
                      return res
                        .status(404)
                        .json({
                          error: 'Image does not exist!'
                        })
                    }

                    const trx = await db.transaction()

                    await trx('images')
                      .where({ id })
                      .delete()
                      .then(() => {
                        fs.unlinkSync(path.resolve(__dirname, '..', '..', data[0].link))
                      })

                    const slide = {
                      link: `uploads/${req.file.filename}`,
                      description,
                      is_slide: true
                    }

                    const ids = await trx('images')
                      .insert(slide)

                    await trx.commit()

                    return res.json({ id: ids[0] })
                  })
                  .catch(Error)
              } else {
                return res.status(401)
                  .json({
                    error: 'Unauthorized access!'
                  })
              }
            })
            .catch(Error)
        } else {
          return res.status(401)
            .json({
              error: 'Unauthorized access!'
            })
        }
      })
      .catch(Error)
  }

  public async delete (req: Request, res: Response) {
    const { email, id } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async isLoggedIn => {
        if (isLoggedIn) {
          await Utils.isAdmin(email)
            .then(async isAdmin => {
              if (isAdmin) {
                await db('images')
                  .select('link')
                  .where({ id })
                  .then(async data => {
                    if (data.length === 0) {
                      return res
                        .status(404)
                        .json({
                          error: 'Image does not exist!'
                        })
                    }

                    await db('images')
                      .where({ id })
                      .delete()
                      .then(() => {
                        fs.unlinkSync(path.resolve(__dirname, '..', '..', data[0].link))
                      })

                    return res.sendStatus(200)
                  })
                  .catch(Error)
              } else {
                return res.status(401)
                  .json({
                    error: 'Unauthorized access!'
                  })
              }
            })
            .catch(Error)
        } else {
          return res.status(401)
            .json({
              error: 'Unauthorized access!'
            })
        }
      })
      .catch(Error)
  }
}

export default new SlideController()
