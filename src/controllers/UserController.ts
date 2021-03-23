import { Request, Response } from 'express'
import crypto from 'crypto'
import Utils from './utils'
import db from '../database/connection'
import argon2 from 'argon2'

class UserController {
  public async profile (req: Request, res: Response) {
    const { id } = req.params
    const { email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async result => {
        if (result) {
          const [user] = await db('users')
            .select(['name', 'email', 'phone'])
            .where({ id, auth })

          return res.json(user)
        }

        return res.status(401).json({
          error: 'Unauthorized access!'
        })
      })
      .catch(Error)
  }

  public async index (req: Request, res: Response) {
    const { page = 1 } = req.query

    const users = await db('users')
      .select(['name', 'email', 'phone'])
      .orderBy('id')
      .limit(5)
      .offset((Number(page) - 1) * 5)

    return res.json(users)
  }

  public async create (req: Request, res: Response) {
    const { name, phone, email, password } = req.body

    const RamdomStr = crypto.randomBytes(16).toString('hex')

    const hash = await argon2.hash(password)
      .catch(Error)

    await db('users').insert({
      name,
      phone,
      email,
      password: hash,
      is_logged_in: true,
      auth: RamdomStr,
      is_admin: false
    })

    const [{ id }] = await db('users').select('id').where({ email, auth: RamdomStr })

    return res
      .header('auth', RamdomStr)
      .json({
        id,
        name
      })
  }

  public async update (req: Request, res: Response) {
    const { id, name, phone, email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async result => {
        if (result) {
          await db('users').update({
            name,
            phone,
            email
          }).where({
            id,
            auth
          })

          return res.sendStatus(200)
        }

        return res.status(401).json({
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
      .then(async result => {
        if (result) {
          await db('users').where({
            id,
            auth
          }).delete()

          return res.sendStatus(200)
        }

        return res.status(401).json({
          error: 'Unauthorized access!'
        })
      })
  }

  public async login (req: Request, res: Response) {
    const { email, password } = req.body

    const RamdomStr = crypto.randomBytes(16).toString('hex')

    const [{ password: hash }] = await db('users')
      .select(['password'])
      .where({ email })

    argon2.verify(hash, password).then(async correct => {
      if (correct) {
        await db('users').where({
          email
        }).update({ auth: RamdomStr, is_logged_in: true })

        let id, name

        try {
          [{ id, name }] = await db('users')
            .select('id', 'name')
            .where({
              email,
              password: hash,
              auth: RamdomStr
            })
        } catch (err) {
          console.log(err)
        }

        return res
          .header('auth', RamdomStr)
          .json({
            id,
            name
          })
      } else {
        return res.status(400).json({
          error: 'Username or/and password are not valid!'
        })
      }
    }).catch(Error)
  }

  public async logout (req: Request, res: Response) {
    const { id, email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
      .then(async result => {
        if (result) {
          await db('users').where({ id, auth }).update({ auth: '', is_logged_in: false })

          return res.sendStatus(200)
        }

        return res.status(401).json({
          error: 'Unauthorized access'
        })
      })
      .catch(Error)
  }
}

export default new UserController()
