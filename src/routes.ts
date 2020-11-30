import express from 'express'
import UserController from './controllers/UserController'
import AddressController from './controllers/AddressController'
import CategoryController from './controllers/CategoryController'
import ProductsController from './controllers/ProductsController'

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

      // Address routes
      this.routes.get('/address', AddressController.index)
      this.routes.post('/address', AddressController.create)
      this.routes.put('/address', AddressController.update)
      this.routes.delete('/address', AddressController.delete)

      // Category
      this.routes.get('/category/:category', CategoryController.profile)
      this.routes.get('/category', CategoryController.index)
      this.routes.post('/category', CategoryController.create)
      this.routes.put('/category', CategoryController.update)
      this.routes.delete('/category', CategoryController.delete)

      // Products
      this.routes.get('/product/:id', ProductsController.index)
      this.routes.post('/product', ProductsController.create)
      this.routes.put('/product', ProductsController.update)
      this.routes.delete('/product', ProductsController.delete)
    }
}

export default new Routes().routes
