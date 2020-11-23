import { Request, Response } from 'express'

class AddressController {
  public async index (req: Request, res: Response) {
    return res.send('Index')
  }

  public async create (req: Request, res: Response) {
    return res.send('Create')
  }

  public async update (req: Request, res: Response) {
    return res.send('Update')
  }

  public async delete (req: Request, res: Response) {
    return res.send('Delete')
  }
}

export default new AddressController()
