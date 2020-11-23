import Knex from 'knex'

export async function up (knex: Knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('phone').notNullable()
    table.string('email').unique().notNullable()
    table.boolean('is_logged_in').notNullable()
    table.string('auth')
    table.boolean('is_admin').notNullable()
    table.string('password').notNullable()
  })
}

export async function down (knex: Knex) {
  return knex.schema.dropTable('users')
}
