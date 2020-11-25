import Knex from 'knex'

export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('address', table => {
    table.string('nickname').primary()
    table.string('UF', 2).notNullable()
    table.string('city').notNullable()
    table.string('neighborhood').notNullable()
    table.string('street').notNullable()
    table.integer('number').notNullable()
    table.string('CEP').notNullable()
    table.integer('user_id').references('id').inTable('users')
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('address')
}
