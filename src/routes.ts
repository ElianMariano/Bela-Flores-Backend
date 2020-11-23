import express from 'express'
import UserController from './controllers/UserController'

class Routes {
    public routes: express.Router = express.Router();

    public constructor () {
      // User routes
      this.routes.get('/profile/:id', UserController.profile)
      // This route should be only accessed by an adminitrator
      // this.routes.get('/index', UserController.index)
      this.routes.post('/user', UserController.create)
      this.routes.put('/user', UserController.update)
      this.routes.delete('/user/:id', UserController.delete)
      this.routes.post('/login', UserController.login)
      this.routes.post('/logout', UserController.logout)
    }
}

export default new Routes().routes
