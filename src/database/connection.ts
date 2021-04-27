import knex from 'knex'
import configuration from '../knexfile'

const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development

const db = knex(config)

export default db
