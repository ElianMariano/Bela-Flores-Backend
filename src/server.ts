import app from './app'

if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT)
} else {
  app.listen(3333)
}
