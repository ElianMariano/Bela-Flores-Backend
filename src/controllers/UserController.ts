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
    const {
      page = 1,
      count = 1
    } = req.query

    const users = await db('users')
      .select(['name', 'email', 'phone'])
      .orderBy('id')
      .limit(Number(count))
      .offset((Number(page) - 1) * Number(count))

    return res.json(users)
  }

  public async create (req: Request, res: Response) {
    const { name, phone, email, cpf, password } = req.body

    const user = await db('users')
      .select('email')
      .where({ email })

    if (user.length === 0 || user === undefined) {
      const RamdomStr = crypto.randomBytes(16).toString('hex')

      const hash = await argon2.hash(password)
        .catch(Error)

      await db('users').insert({
        name,
        phone,
        email,
        cpf,
        password: hash,
        is_logged_in: true,
        auth: RamdomStr,
        is_admin: false
      }).catch(Error)

      const [{ id }] = await db('users').select('id').where({ email, auth: RamdomStr })

      return res
        .header('auth', RamdomStr)
        .json({
          id,
          name,
          is_admin: false
        })
    }

    return res.status(401)
      .json({
        error: 'email already exists!'
      })
  }

  public async update (req: Request, res: Response) {
    const { id, name, phone, email } = req.body
    const { auth } = req.headers

    const user = await db('users')
      .select('email')
      .where({ email })

    if (user.length === 0 || user === undefined) {
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

    return res.status(401)
      .json({
        error: 'email already exists!'
      })
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

    const user = await db('users')
      .select('email')
      .where({ email })

    if (user.length === 0 || user === undefined) {
      return res.status(400).json({
        error: 'User does not exists!'
      })
    }

    const RamdomStr = crypto.randomBytes(16).toString('hex')

    const [{ password: hash }] = await db('users')
      .select(['password'])
      .where({ email })

    argon2.verify(hash, password).then(async correct => {
      if (correct) {
        await db('users').where({
          email
        }).update({ auth: RamdomStr, is_logged_in: true })

        let id, name, isAdmin

        try {
          [{ id, name, is_admin: isAdmin }] = await db('users')
            .select('id', 'name', 'is_admin', 'email')
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
            name,
            email,
            admin: isAdmin
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

    const user = await db('users')
      .select('email')
      .where({ email })

    if (user.length === 0 || user === undefined) {
      return res.status(400).json({
        error: 'User does not exists!'
      })
    }

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
