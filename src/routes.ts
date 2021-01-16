import express from 'express'
import multer from 'multer'
import multerConfig from './multer'
import UserController from './controllers/UserController'
import AddressController from './controllers/AddressController'
import CategoryController from './controllers/CategoryController'
import ProductsController from './controllers/ProductsController'
import SlideController from './controllers/SlideController'
import OrderController from './controllers/OrderController'
import CartController from './controllers/CartController'

class Routes {
    public routes: express.Router = express.Router();
    public upload = multer(multerConfig)

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

      // Images
      this.routes.get('/slide', SlideController.index)
      this.routes.post('/slide', this.upload.single('image'), SlideController.create)
      this.routes.put('/slide', this.upload.single('image'), SlideController.update)
      this.routes.delete('/slide', SlideController.delete)

      // Order
      this.routes.get('/order', OrderController.index)
      this.routes.post('/order', OrderController.create)
      this.routes.put('/order', OrderController.update)
      this.routes.delete('/order/:id', OrderController.delete)

      // Cart
      this.routes.get('/cart', CartController.index)
      this.routes.post('/cart', CartController.create)
      this.routes.put('/cart', CartController.update)
      this.routes.delete('/cart/:id', CartController.delete)
    }
}

export default new Routes().routes
