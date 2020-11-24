import { Request, Response } from 'express'
import Utils from './utils'
import db from '../database/connection'

class AddressController {
  public async index (req: Request, res: Response) {
    const {
      email,
      auth
    } = req.body

    await Utils.isLoggedIn(email, auth)
      .then(async result => {
        if (result) {
          const address = await db('address')
            .select('*')

          return res.status(200)
            .json(address)
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
      auth,
      nickname,
      UF,
      city,
      neighborhood,
      street,
      number,
      CEP
    } = req.body

    await Utils.isLoggedIn(email, auth)
      .then(async result => {
        if (result) {
          const [{ id }] = await db('users')
            .select('id')
            .where({
              email,
              auth
            })

          await db('address')
            .insert({
              nickname,
              UF,
              city,
              neighborhood,
              street,
              number,
              CEP,
              user_id: id
            })

          const [{ id: AddressId }] = await db('address')
            .select('id')
            .where({ nickname })

          return res.status(200)
            .json({
              id: AddressId
            })
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
      nickname,
      UF,
      city,
      neighborhood,
      street,
      number,
      CEP,
      address_id: AddressId
    } = req.body

    await Utils.isLoggedIn(email, auth)
      .then(async result => {
        if (result) {
          const [{ id }] = await db('users')
            .select('id')
            .where({
              email,
              auth
            })

          await db('address')
            .update({
              nickname,
              UF,
              city,
              neighborhood,
              street,
              number,
              CEP,
              user_id: id
            })
            .where({ id: AddressId })

          return res.sendStatus(200)
        }

        return res.status(401)
          .json({
            error: 'Unauthorized access!'
          })
      })
      .catch(Error)
  }

  public async delete (req: Request, res: Response) {
    const {
      email,
      auth,
      address_id: AddressId
    } = req.body

    await Utils.isLoggedIn(email, auth)
      .then(async result => {
        if (result) {
          await db('address')
            .where({ id: AddressId })
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

export default new AddressController()
