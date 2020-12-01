import { Request, Response } from 'express'
import Utils from './utils'
import db from '../database/connection'

interface AddressProps{
  address: string
}

class AddressController {
  public async index (req: Request, res: Response) {
    const { email } = req.body
    const { auth } = req.headers

    await Utils.isLoggedIn(email, String(auth))
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
      nickname,
      UF,
      city,
      neighborhood,
      street,
      number,
      CEP
    } = req.body
    const { auth } = req.headers

    let address
    try {
      [{ nickname: address }] = await db('address')
        .select('nickname')
        .where({ nickname })
    } catch (err) {
      console.log(err)
    }

    if (address === nickname || address !== undefined) {
      return res.status(406)
        .json({
          error: 'Address nickname already exists!'
        })
    }

    await Utils.isLoggedIn(email, String(auth))
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

          const [{ nickname: AddressId }] = await db('address')
            .select('nickname')
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
      new_nickname: nickname,
      UF,
      city,
      neighborhood,
      street,
      number,
      CEP,
      nickname: AddressId
    } = req.body

    const { auth } = req.headers

    await db('address')
      .select('nickname')
      .where('nickname', AddressId)
      .then(result => {
        const [{ nickname: address }] = result

        if (address === undefined) {
          return res.status(404)
            .json({
              error: 'Address does not exist!'
            })
        }
      })
      .catch(Error)

    let address
    try {
      [{ nickname: address }] = await db('address')
        .select('nickname')
        .where({ nickname: nickname })
    } catch (err) {
      console.log(err)
    }

    if (address === nickname) {
      return res.status(406)
        .json({
          error: 'New Address nickname already exists!'
        })
    }

    await Utils.isLoggedIn(email, String(auth))
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
            .where({ nickname: AddressId })

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
      nickname
    } = req.body
    const { auth } = req.headers

    let address
    try {
      [{ nickname: address }] = await db('address')
        .select('nickname')
        .where({ nickname })
    } catch (err) {
      console.log(err)
    }

    if (address === undefined) {
      return res.status(404)
        .json({
          error: 'Address does not exists!'
        })
    }

    await Utils.isLoggedIn(email, String(auth))
      .then(async result => {
        if (result) {
          await db('address')
            .where({ nickname })
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
