import knex from 'knex'
import configuration from '../knexfile'

let config = configuration.production

switch (process.env.NODE_ENV) {
  case 'test':
    config = configuration.test
    break
  case 'development':
    config = configuration.development
    break
}

const db = knex(config)

export default db
