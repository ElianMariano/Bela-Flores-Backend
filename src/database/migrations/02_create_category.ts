import Knex from 'knex'

export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('category', table => {
    table.string('category').primary()
    table.string('description')
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('category')
}
