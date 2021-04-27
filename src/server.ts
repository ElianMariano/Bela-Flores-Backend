import app from './app'

if (process.env.STAGE === 'production') {
  app.listen(process.env.PORT)
} else {
  app.listen(3333)
}
