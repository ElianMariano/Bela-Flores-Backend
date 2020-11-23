import Knex from 'knex'

export async function up (knex: Knex) {
  return knex.schema.createTable('address', table => {
    table.increments('id').primary()
    table.string('nickname').notNullable()
    table.string('UF', 2).notNullable()
    table.string('city').notNullable()
    table.string('neighborhood').notNullable()
    table.string('street').notNullable()
    table.integer('number').notNullable()
    table.integer('user_id').references('id').inTable('users')
    table.string('CEP').notNullable()
  })
}

export async function down (knex: Knex) {
  return knex.schema.dropTable('address')
}
