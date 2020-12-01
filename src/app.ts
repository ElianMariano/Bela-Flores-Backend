import express from 'express'
import cors from 'cors'
import path from 'path'
import routes from './routes'

class App {
    public express: express.Application

    public constructor () {
      this.express = express()

      this.midddlewares()

      this.routes()
    }

    private midddlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
      this.express.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
    }

    private routes (): void {
      this.express.use(routes)
    }
}

export default new App().express
