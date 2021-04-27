import Knex from 'knex'

// TODO Do a refactor to this file
export async function up (knex: Knex) : Promise<void> {
  return knex.schema.createTable('slide', table => {
    table.increments('id').primary()
    table.string('link').notNullable()
    table.string('description').notNullable()
    table.integer('product_id').references('id').inTable('products')
  })
}

export async function down (knex: Knex) : Promise<void> {
  return knex.schema.dropTable('images')
}
